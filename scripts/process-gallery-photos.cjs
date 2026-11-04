const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC_DIR = path.join(__dirname, "..", "public_originals_raw", "Products");
const OUT_DIR = path.join(__dirname, "..", "public", "products");
const SIZE = 1200;
const QUALITY = 82;

// Extra single-product angle shots per product (combo/multi-product shots excluded).
const MAP = {
  "black-funky": ["black funky 2.jpg"],
  "black-serenity": ["black serenity 2.jpg", "black serenity 3.jpg"],
  "bluishpink-serenity": ["bluishpink serenity 2.jpg", "bluishpink serenity 3.jpg"],
  "brown-glow": ["brown glow 2.jpg", "brown glow 3.jpg"],
  "leopard-funky": ["leopard funky 2.jpg", "leopard funky 3.jpg"],
  "roseate-glow": ["roseate glow 2.jpg", "roseate glow 3.jpg"],
  "transparent-funky": ["transparent funky 2.jpg", "transparent funky 3.jpg"],
  "white-funky": ["white funky 2.jpg", "White funky 3.jpg"],
};

async function process() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const [slug, files] of Object.entries(MAP)) {
    let index = 2;
    for (const srcName of files) {
      const inputPath = path.join(SRC_DIR, srcName);
      if (!fs.existsSync(inputPath)) {
        console.warn(`Missing: ${srcName}`);
        continue;
      }
      const outName = `${slug}-${index}.webp`;
      const outputPath = path.join(OUT_DIR, outName);

      await sharp(inputPath)
        .rotate() // auto-orient from EXIF only, no manual rotation
        .resize({
          width: SIZE,
          height: SIZE,
          fit: "cover",
          position: sharp.strategy.attention,
        })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const size = fs.statSync(outputPath).size;
      console.log(`${srcName} -> ${outName}: ${(size / 1024).toFixed(0)}KB`);
      index++;
    }
  }
}

process();
