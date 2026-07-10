// One-time hero-frame optimizer.
// Source: art-source/hero-frames-original/ezgif-frame-001..120.webp (1920x1080, ~6.9MB)
//   (kept OUT of public/ so the heavy originals never ship to production)
// Output: public/assets/hero-frames/frame-001..NNN.webp (downscaled, recompressed)
//
// Run:  node scripts/optimize-hero-frames.mjs
import sharp from 'sharp'
import { mkdir, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const SRC_DIR   = path.resolve('art-source/hero-frames-original')
const OUT_DIR   = path.resolve('public/assets/hero-frames')
const KEEP      = 60      // final frame count (evenly sampled from source)
const MAX_WIDTH = 1280    // downscale target — plenty for a background layer
const QUALITY   = 72      // WebP quality

const srcFrames = (await readdir(SRC_DIR))
  .filter((f) => /^ezgif-frame-\d+\.webp$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

if (srcFrames.length === 0) {
  console.error('No source frames found in', SRC_DIR)
  process.exit(1)
}

await mkdir(OUT_DIR, { recursive: true })

// Evenly sample KEEP frames across the whole sequence (keeps first & last).
const total = srcFrames.length
const picks = Array.from({ length: KEEP }, (_, i) =>
  Math.round((i * (total - 1)) / (KEEP - 1))
)

let srcBytes = 0
let outBytes = 0

for (let i = 0; i < picks.length; i++) {
  const srcFile = path.join(SRC_DIR, srcFrames[picks[i]])
  const outFile = path.join(OUT_DIR, `frame-${String(i + 1).padStart(3, '0')}.webp`)

  srcBytes += (await stat(srcFile)).size

  await sharp(srcFile)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(outFile)

  outBytes += (await stat(outFile)).size
}

const mb = (n) => (n / 1024 / 1024).toFixed(2) + ' MB'
console.log(`Frames:  ${total} -> ${KEEP}`)
console.log(`Size:    ${mb(srcBytes)} -> ${mb(outBytes)}  (${Math.round((1 - outBytes / srcBytes) * 100)}% smaller)`)
console.log(`Output:  ${path.relative(process.cwd(), OUT_DIR)}/frame-001..${String(KEEP).padStart(3, '0')}.webp`)
if (!existsSync(OUT_DIR)) console.error('WARNING: output dir missing')
