import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export async function identify(port) {
  try {
    const result = await fetch(
      "http://127.0.0.1:" + port + "/manifest.webmanifest",
      { signal: AbortSignal.timeout(1200), redirect: "error" },
    );
    if (!result.ok || !result.headers.get("content-type")?.includes("json"))
      return "occupied";
    const manifest = await result.json();
    return manifest.short_name === "Luma" &&
      manifest.name === "Luma · Inglés con ciencia" &&
      manifest.id === "/"
      ? "luma"
      : "occupied";
  } catch (error) {
    return error.cause?.code === "ECONNREFUSED" ? "free" : "occupied";
  }
}

async function main() {
  const requested = Number(process.env.LUMA_PORT || 4173);
  if (!Number.isInteger(requested) || requested < 1 || requested > 65535)
    throw new Error("Puerto de Luma no válido.");
  let port = requested,
    state = await identify(port);
  while (state === "occupied" && !process.env.LUMA_PORT && port < 4183) {
    port++;
    state = await identify(port);
  }
  if (state === "occupied")
    throw new Error(
      "El puerto está ocupado. Configura LUMA_PORT con un puerto disponible.",
    );
  const url = "http://127.0.0.1:" + port + "/";
  if (state === "free") {
    process.env.LUMA_PORT = String(port);
    await import("../server.mjs");
    for (
      let tries = 0;
      tries < 20 && (await identify(port)) !== "luma";
      tries++
    )
      await new Promise((done) => setTimeout(done, 100));
    if ((await identify(port)) !== "luma")
      throw new Error("Luma no pudo abrir el servidor.");
    console.log(
      "Mantén esta ventana abierta mientras estudias. Ctrl+C cierra el servidor.",
    );
  }
  console.log(url);
  if (process.platform === "win32") {
    const child = spawn("rundll32.exe", ["url.dll,FileProtocolHandler", url], {
      detached: true,
      windowsHide: true,
      stdio: "ignore",
    });
    child.on("error", () =>
      console.log("Abre el enlace mostrado en tu navegador."),
    );
    child.unref();
  }
}
if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
) {
  await main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
