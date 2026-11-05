// Image optimization pass (Lighthouse "Improve image delivery" fix).
// Re-encodes existing public/images/*.webp assets at appropriately reduced
// pixel dimensions and WebP quality for how they're actually displayed, per
// the components that render them (see conversation history for the size
// math per file). Run with `node scripts/optimize-images.cjs`; not part of
// the build. Each step is idempotent-ish but NOT lossless to re-run — most
// read from an already-resized/recompressed file on disk (the original
// full-res source was overwritten in place), so re-running an already-done
// step just adds a redundant lossy recompression pass for no size benefit.
// Comment out whichever steps you've already applied before re-running.
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const DIR = path.join(__dirname, "..", "public", "images");

// Read the whole source into memory up front rather than handing sharp the
// file path directly — sharp/libvips can keep the source file handle open
// for its operation cache, which blocks overwriting that same path (a
// silent, and on Windows fatal, hazard whenever src === out below).
async function writeResized(srcFile, outFile, width, quality) {
  const src = path.join(DIR, srcFile);
  const out = path.join(DIR, outFile);
  const srcBuffer = fs.readFileSync(src);
  const before = srcBuffer.length;
  const resized = await sharp(srcBuffer)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
  fs.writeFileSync(out, resized);
  console.log(
    `${outFile}: ${(before / 1024).toFixed(1)} KiB -> ${(resized.length / 1024).toFixed(1)} KiB (width ${width}, q${quality})`,
  );
}

async function heroPortrait() {
  // Hero.jsx draws hero-image.webp (1672x941) with object-cover inside a
  // ~100vh-tall box scaled 1.15 for parallax, so it renders >=1570 CSS px
  // wide on every screen: narrower *width* variants would only blur it.
  // What tall screens do waste is width: at aspect <= 3/4 (phones, tablets
  // in portrait) only the central <=770 source px are ever visible. Ship a
  // centre crop for those via <picture>. At 780px wide the cover scale stays
  // height-driven for any aspect <= 3/4, so it renders identically.
  // q82 (not 78): this re-encodes an already-lossy WebP.
  const src = path.join(DIR, "hero-image.webp");
  const out = path.join(DIR, "hero-image-portrait.webp");
  const srcBuffer = fs.readFileSync(src);
  const { width, height } = await sharp(srcBuffer).metadata();
  const cropWidth = 780;
  const cropped = await sharp(srcBuffer)
    .extract({
      left: Math.round((width - cropWidth) / 2),
      top: 0,
      width: cropWidth,
      height,
    })
    .webp({ quality: 82 })
    .toBuffer();
  fs.writeFileSync(out, cropped);
  console.log(
    `hero-image-portrait.webp: ${(srcBuffer.length / 1024).toFixed(1)} KiB -> ${(cropped.length / 1024).toFixed(1)} KiB (${cropWidth}x${height} centre crop, q82)`,
  );
}

async function lookbookMobileVariant() {
  // InspirationSection.jsx's Carousel sizes its active slide per
  // CAROUSEL_TIERS: up to 240px CSS-wide below the sm breakpoint, 330px
  // below lg, 404px at lg+. The existing 900w file (≈2x the lg tier) covers
  // desktop well but is ~4x more than a phone at 1-2x DPR ever needs — this
  // 480w variant (≈2x the base tier) lets mobile stop overpaying via a
  // srcset, added to InspirationSection.jsx alongside the existing 900w.
  for (const f of [
    "lookbook-bags.webp",
    "lookbook-dresses.webp",
    "lookbook-jewellery.webp",
    "lookbook-shoes.webp",
  ]) {
    const base = f.replace(".webp", "");
    await writeResized(f, `${base}-480.webp`, 480, 78);
  }
}

async function productsBackground() {
  // CoverBackgroundSection.jsx shows this as a bg-cover CSS background
  // inside a fixed 316px-tall band, permanently under backdrop-blur-md —
  // compression artifacts are invisible under that blur, so this can take
  // a much more aggressive pass than a normal photo. Source was an
  // unresized 3024x4032 (12MP) phone photo.
  await writeResized(
    "products-background.webp",
    "products-background.webp",
    1600,
    65,
  );
}

(async () => {
  await heroPortrait();
  // Already applied in an earlier pass — uncomment only if you have a fresh
  // full-resolution source to re-derive these from.
  // await lookbookMobileVariant();
  // await productsBackground();
})();
