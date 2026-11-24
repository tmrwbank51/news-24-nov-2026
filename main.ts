// News-image entry for 24 November 2026.
//
// The repository ships the finished image (entry.png, JPEG bytes under a
// .png name — the rules tell the file apart by its first bytes). This
// program only copies that image into the grader's output directory, so
// both grader runs produce byte-identical output. After copying it checks
// the result: the written file must match the source byte for byte in size
// and stay under the 1 MiB cap, and it logs the sha256 so the two grader
// runs can be compared.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoDir = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const sourcePath = join(repoDir, "entry.png");
const targetPath = join(outDir, "entry.png");

// Create the output directory if it is missing. Never delete it: the
// grader owns it, and removing it would fail the run.
mkdirSync(outDir, { recursive: true });
copyFileSync(sourcePath, targetPath);

const written = readFileSync(targetPath);
const sourceSize = statSync(sourcePath).size;
if (written.length !== sourceSize) {
  throw new Error(
    `copy mismatch: wrote ${written.length} bytes but the source is ${sourceSize}`,
  );
}
if (written.length > 1048576) {
  throw new Error(`entry.png is ${written.length} bytes, over the 1 MiB cap`);
}
const digest = createHash("sha256").update(written).digest("hex");
console.log(`wrote ${targetPath} (${written.length} bytes, sha256 ${digest})`);
