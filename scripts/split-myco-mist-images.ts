/**
 * Builds per-SKU Myco Mist images from the client lineup photo.
 * Band colors (L→R): orange Energy, blue Focus, purple Calm, green Immune, grey Sleep.
 */
import sharp from "sharp";
import { resolve } from "path";

const SRC = resolve(process.cwd(), "public/images/products/myco-mist.jpg");
const OUT_DIR = resolve(process.cwd(), "public/images/products");

const VARIANTS: { file: string; region: { left: number; top: number; width: number; height: number } }[] = [
  { file: "myco-mist-energy.jpg", region: { left: 48, top: 38, width: 158, height: 485 } },
  { file: "myco-mist-focus.jpg", region: { left: 286, top: 34, width: 108, height: 488 } },
  { file: "myco-mist-calm.jpg", region: { left: 428, top: 18, width: 172, height: 512 } },
  { file: "myco-mist-immune.jpg", region: { left: 578, top: 40, width: 142, height: 475 } },
  { file: "myco-mist-sleep.jpg", region: { left: 718, top: 48, width: 268, height: 455 } },
];

async function main() {
  for (const { file, region } of VARIANTS) {
    const out = resolve(OUT_DIR, file);
    await sharp(SRC)
      .extract(region)
      .resize(800, 1000, { fit: "cover", position: "centre" })
      .jpeg({ quality: 88 })
      .toFile(out);
    console.log(`Wrote ${file}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
