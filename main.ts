// news-image-20261124 v2 — copies the pre-built newspaper front page to the
// harness output directory. Node 22, stdlib only, no network, no clock.
// Output: <MAKEFUN_OUTPUT_DIR>/output/entry.png (or /output/entry.png when
// MAKEFUN_OUTPUT_DIR is unset). Creates the output directory if missing;
// never deletes anything.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const base = process.env.MAKEFUN_OUTPUT_DIR;
const outDir = base ? join(base, "output") : "/output";
const src = join(here, "entry.png");
const dst = join(outDir, "entry.png");

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);
const data = readFileSync(dst);
if (data.length > 1048576) {
  throw new Error(`entry.png is ${data.length} bytes, over the 1 MiB limit`);
}
const sha = createHash("sha256").update(data).digest("hex");
console.log(`wrote ${dst} (${data.length} bytes, sha256 ${sha})`);
