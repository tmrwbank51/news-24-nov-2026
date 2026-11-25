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
// Validate the file format from its magic bytes: JPEG starts with SOI
// (0xFF 0xD8), PNG with its 8-byte signature. The contest names the file
// entry.png either way, so the bytes — not the name — decide the format.
let format;
if (data[0] === 0xff && data[1] === 0xd8) {
  format = "JPEG";
} else if (
  data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47 &&
  data[4] === 0x0d && data[5] === 0x0a && data[6] === 0x1a && data[7] === 0x0a
) {
  format = "PNG";
} else {
  throw new Error("entry.png is neither JPEG nor PNG (bad magic bytes)");
}
const sha = createHash("sha256").update(data).digest("hex");
console.log(`wrote ${dst} (${format}, ${data.length} bytes, sha256 ${sha})`);
