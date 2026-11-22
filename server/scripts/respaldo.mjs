import { backup, DatabaseSync } from "node:sqlite";
import { access, link, mkdir, mkdtemp, rm } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";

const [source, destination] = process.argv.slice(2);
if (!source || !destination)
  throw new Error("Uso: node scripts/respaldo.mjs BASE_ORIGINAL NUEVA_COPIA");
const target = resolve(destination);
await access(resolve(source));
await mkdir(dirname(target), { recursive: true });
const temp = await mkdtemp(join(dirname(target), ".luma-copia-"));
const staged = join(temp, basename(target));
let original, copy;
try {
  original = new DatabaseSync(resolve(source), { readOnly: true });
  original
    .prepare("SELECT profile,key,value FROM learner_values LIMIT 1")
    .get();
  await backup(original, staged);
  copy = new DatabaseSync(staged, { readOnly: true });
  if (copy.prepare("PRAGMA quick_check").get().quick_check !== "ok")
    throw new Error("Copia incompleta.");
  copy.close();
  copy = undefined;
  // Linking the verified copy publishes it atomically and refuses existing destinations.
  await link(staged, target);
  process.stdout.write("Copia de Luma verificada: " + target + "\n");
} finally {
  copy?.close();
  original?.close();
  await rm(temp, { recursive: true, force: true });
}
