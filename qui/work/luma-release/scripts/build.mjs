import assert from "node:assert/strict";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const project = dirname(dirname(fileURLToPath(import.meta.url)));
const publicDir = join(project, "public");
const dist = join(project, "dist");
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
};
async function listFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.isSymbolicLink())
      throw new Error("Unexpected asset: " + entry.name);
    const file = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await listFiles(file)));
    else if (entry.isFile()) found.push(file);
  }
  return found.sort();
}
const { createHash } = await import("node:crypto");
const editorial = (await listFiles(publicDir)).filter(
  (file) => relative(publicDir, file) !== "sw.js" && !file.endsWith(".txt"),
);
const resources = editorial.map((file) =>
  relative(publicDir, file).split(sep).join("/"),
);
const template = await readFile(
  join(project, "scripts", "service-worker.template.js"),
  "utf8",
);
const revision = createHash("sha256").update(template);
for (const file of editorial) {
  revision.update(relative(publicDir, file).split(sep).join("/"));
  revision.update(await readFile(file));
}
const serviceWorker = template
  .replace("__EDITION__", revision.digest("hex").slice(0, 16))
  .replace("__PUBLIC_PATHS__", JSON.stringify(resources));
await writeFile(join(publicDir, "sw.js"), serviceWorker);
const table = {};
for (const file of await listFiles(publicDir)) {
  const path = "/" + relative(publicDir, file).split(sep).join("/");
  const bytes = await readFile(file),
    type = types[extname(file).toLowerCase()];
  if (!type) throw new Error("Unknown media type: " + path);
  table[path] = [type, bytes.length, bytes.toString("base64")];
}
assert.ok(table["/index.html"], "Missing index.html");
const document = Buffer.from(table["/index.html"][2], "base64").toString();
for (const ref of document.matchAll(
  /<(?:script|link)\b[^>]*?\b(?:src|href)="([^"]+)"/g,
)) {
  if (!ref[1].startsWith("https://"))
    assert.ok(
      table["/" + ref[1].replace(/^\//, "")],
      "Missing asset: " + ref[1],
    );
}

const apiSource = await readFile(join(project, "backend", "api.mjs"), "utf8");
const declaration = /^export default\s*\{/gm;
assert.equal(
  [...apiSource.matchAll(declaration)].length,
  1,
  "Expected one API default export",
);
const embeddedApi = apiSource.replace(declaration, "const lumaApi = {");
const manifest = JSON.parse(
  await readFile(join(project, ".openai", "hosting.json"), "utf8"),
);
assert.equal(manifest.d1, "DB");
assert.ok(manifest.project_id && !manifest.static);
const wrapper = `
const packedAssets=${JSON.stringify(table)};
export default {
  async fetch(request,env,ctx){
    const url=new URL(request.url);
    if(url.pathname.startsWith('/api/')){
      return lumaApi.fetch(request,env,ctx,true);
    }
    if(request.method!=='GET' && request.method!=='HEAD')return new Response(null,{status:405,headers:{Allow:'GET, HEAD'}});
    const key=url.pathname==='/' ? '/index.html' : url.pathname;
    const asset=Object.hasOwn(packedAssets,key) ? packedAssets[key] : null;
    if(!asset)return new Response('No se encontró el recurso.',{status:404});
    const [type,length,base64]=asset;
    const headers={'Content-Type':type,'Content-Length':String(length),'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'};
    const body=request.method==='HEAD' ? null : Uint8Array.from(atob(base64),c=>c.charCodeAt(0));
    return new Response(body,{headers});
  }
};
`;
await Promise.all([
  mkdir(join(dist, "server"), { recursive: true }),
  mkdir(join(dist, ".openai"), { recursive: true }),
]);
await writeFile(join(dist, "server", "index.js"), embeddedApi + "\n" + wrapper);
await writeFile(
  join(dist, ".openai", "hosting.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  "Luma · " + Object.keys(table).length + " recursos integrados en el Worker.",
);
