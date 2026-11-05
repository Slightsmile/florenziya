const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "..", "public", "product-photos");
const files = fs.readdirSync(srcDir).filter((f) => f.toLowerCase().endsWith(".png"));

const slugify = (base) =>
  base
    .toLowerCase()
    .replace(/[()]/g, "")
    .trim()
    .replace(/\s+/g, "-");

async function run() {
  for (const file of files) {
    const match = file.match(/^(.+?)\s*\((\d+)\)\.png$/i);
    if (!match) continue;
    const [, name, num] = match;
    const slug = slugify(name);
    const outName = num === "1" ? `${slug}.webp` : `${slug}-${num}.webp`;
    const outPath = path.join(srcDir, outName);

    await sharp(path.join(srcDir, file))
      .resize(1000, 1000, { fit: "cover" })
      .webp({ quality: 80 })
      .toFile(outPath);

    const srcSize = fs.statSync(path.join(srcDir, file)).size;
    const outSize = fs.statSync(outPath).size;
    console.log(`${file} -> ${outName}  ${(srcSize / 1024).toFixed(0)}KB -> ${(outSize / 1024).toFixed(0)}KB`);

    fs.unlinkSync(path.join(srcDir, file));
  }
}

run();
