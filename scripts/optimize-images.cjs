// One-off image optimization pass (Lighthouse "Improve image delivery" fix).
// Re-encodes existing public/images/*.webp assets at appropriately reduced
// pixel dimensions and WebP quality for how they're actually displayed, per
// the components that render them (see conversation for the size math per
// file). Run with `node scripts/optimize-images.cjs`; not part of the build.
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

(async () => {
  // Hero.jsx renders this full-bleed on mobile down to ~half the container
  // on desktop — genuinely different displayed sizes per viewport, so ship
  // 3 widths for a srcset instead of one fixed file.
  await writeResized("hero-bg.webp", "hero-bg-640.webp", 640, 78);
  await writeResized("hero-bg.webp", "hero-bg-1024.webp", 1024, 78);
  await writeResized("hero-bg.webp", "hero-bg.webp", 1408, 78); // overwrite original in place

  // InspirationSection.jsx's Carousel caps the active slide at 404x582 CSS
  // px even on desktop (see Carousel.jsx's CAROUSEL_TIERS) — one file sized
  // for ~2x that covers every breakpoint without a srcset.
  for (const f of [
    "lookbook-bags.webp",
    "lookbook-dresses.webp",
    "lookbook-jewellery.webp",
    "lookbook-shoes.webp",
  ]) {
    await writeResized(f, f, 900, 78);
  }

  // CoverBackgroundSection.jsx shows this as a bg-cover CSS background
  // inside a fixed 316px-tall band, permanently under backdrop-blur-md —
  // compression artifacts are invisible under that blur, so this can take
  // a much more aggressive pass than a normal photo. Source was an
  // unresized 3024x4032 (12MP) phone photo.
  await writeResized("products-background.webp", "products-background.webp", 1600, 65);
})();
