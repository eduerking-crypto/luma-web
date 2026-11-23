#!/usr/bin/env node
// Reconstruye el APK apuntando a tu URL de Cloudflare Pages.
// Uso: node actualizar-apk.mjs https://luma-tu-usuario.pages.dev
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const configPath = join(root, "capacitor.config.json");

const url = process.argv[2];
if (!url || !/^https:\/\/[\w.-]+/.test(url)) {
  console.error("Uso: node actualizar-apk.mjs https://tu-proyecto.pages.dev");
  process.exit(1);
}
const clean = url.replace(/\/+$/, "");

// 1. Actualiza capacitor.config.json
const config = JSON.parse(readFileSync(configPath, "utf8"));
config.server = config.server || {};
config.server.url = clean;
writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
console.log(`capacitor.config.json -> ${clean}`);

// 2. Sincroniza y compila
const env = { ...process.env };
if (process.platform === "win32") {
  env.ANDROID_HOME = env.ANDROID_HOME || join(process.env.LOCALAPPDATA, "Android", "Sdk");
  env.ANDROID_SDK_ROOT = env.ANDROID_HOME;
}

console.log("Sincronizando Capacitor...");
execSync("npx cap sync android", { cwd: root, stdio: "inherit" });

console.log("Compilando APK release...");
execSync("gradlew.bat assembleRelease --no-daemon", {
  cwd: join(root, "android"),
  stdio: "inherit",
  env,
});

const apk = join(root, "android", "app", "build", "outputs", "apk", "release", "app-release.apk");
const dest = join(root, "Luma-v1.0-release.apk");
import("node:fs").then((fs) => fs.copyFileSync(apk, dest));

console.log("\n========================================");
console.log("APK listo: " + dest);
console.log("La app ahora carga desde: " + clean);
console.log("Cada cambio en la web se refleja solo.");
console.log("========================================");