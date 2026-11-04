const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PRODUCTS_DIR = path.join(__dirname, "..", "public", "products");
const MAX_WIDTH = 1200;
const QUALITY = 78;

async function optimize() {
  const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

  for (const file of files) {
    const inputPath = path.join(PRODUCTS_DIR, file);
    const outputName = file.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    const outputPath = path.join(PRODUCTS_DIR, outputName);

    const beforeSize = fs.statSync(inputPath).size;

    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath);

    const afterSize = fs.statSync(outputPath).size;
    fs.unlinkSync(inputPath);

    console.log(
      `${file} -> ${outputName}: ${(beforeSize / 1024).toFixed(0)}KB -> ${(afterSize / 1024).toFixed(0)}KB`
    );
  }
}

optimize();
