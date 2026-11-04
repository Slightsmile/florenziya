const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC_DIR = path.join(__dirname, "..", "public_originals_raw", "Products");
const OUT_DIR = path.join(__dirname, "..", "public", "products");
const SIZE = 1200;
const QUALITY = 82;

// Maps output filename -> source filename (canonical hero shot per product)
const MAP = {
  "black-funky.webp": "Black Funky.jpg",
  "black-serenity.webp": "Black Serenity.jpg",
  "bluishpink-serenity.webp": "BluishPink Serenity.jpg",
  "brown-glow.webp": "Brown Glow.jpg",
  "leopard-funky.webp": "Leopard Funky.jpg",
  "roseate-glow.webp": "Roseate Glow.jpg",
  "transparent-funky.webp": "Transparent Funky.jpg",
  "white-funky.webp": "White Funky.jpg",
};

async function process() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const [outName, srcName] of Object.entries(MAP)) {
    const inputPath = path.join(SRC_DIR, srcName);
    const outputPath = path.join(OUT_DIR, outName);

    const meta = await sharp(inputPath).metadata();
    const orientation = meta.orientation || 1;
    const swapped = orientation >= 5 && orientation <= 8;
    const w = swapped ? meta.height : meta.width;
    const h = swapped ? meta.width : meta.height;

    // Crop a centered square focused on the lower-middle band where the
    // product sits consistently across all source photos (same rig/angle).
    const side = Math.round(Math.min(w, h));
    const left = Math.round((w - side) / 2);
    const idealTop = Math.round(h * 0.42 - side / 2);
    const top = Math.max(0, Math.min(idealTop, h - side));

    await sharp(inputPath)
      .rotate()
      .extract({ left, top, width: side, height: side })
      .resize({ width: SIZE, height: SIZE, fit: "cover" })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const size = fs.statSync(outputPath).size;
    console.log(`${srcName} -> ${outName}: ${(size / 1024).toFixed(0)}KB`);
  }
}

process();
