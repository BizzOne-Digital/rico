/**
 * Copies client WhatsApp product photos into public/images/products (and categories).
 * Run: npx tsx scripts/install-product-images.ts
 */
import { execSync } from "child_process";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { resolve, join } from "path";

const ASSETS_DIR =
  process.env.PRODUCT_ASSETS_DIR ??
  resolve(
    process.env.USERPROFILE || process.env.HOME || "",
    ".cursor",
    "projects",
    "e-2sri-nokri-rico",
    "assets"
  );

const PUBLIC_PRODUCTS = resolve(process.cwd(), "public", "images", "products");
const PUBLIC_CATEGORIES = resolve(process.cwd(), "public", "images", "categories");

/** destination filename -> source asset basename (must exist in ASSETS_DIR) */
const COPIES: Record<string, string> = {
  "cordyceps-capsules.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.29.42_PM__2_-84b3ba97-5e66-4a06-9778-407ed8fcee32.jpg",
  "cordyceps-capsules-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.20_PM__4_-43211f1c-7448-473c-ae81-6f4524555518.jpg",
  "lions-mane-capsules.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.29.42_PM-f96753bf-51a1-46b1-b374-1b4c684e2e23.jpg",
  "lions-mane-capsules-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.20_PM__7_-7139029c-45d9-4ffc-8809-f531561f3a67.jpg",
  "turkey-tail-capsules.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.29.42_PM__1_-6a712e87-7b8e-4763-9e52-510810608e5c.jpg",
  "turkey-tail-capsules-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.21_PM-0a8cd390-2f0d-46d2-b7e2-d2251364c8df.jpg",
  "my-gut-capsules.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.29.43_PM-fa04c9dd-ee16-4eba-84e2-9cdca182b928.jpg",
  "my-gut-capsules-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.20_PM__6_-9aeaf242-1308-4c23-ab78-2699bf223342.jpg",
  "my-focus-oral-drops.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.29.43_PM__6_-126678ac-a74c-4b89-81f2-e214433cc83b.jpg",
  "my-focus-oral-drops-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.21_PM__2_-b9b3080d-563a-4af4-b49c-597e07204c0e.jpg",
  "my-fuel-oral-drops.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.29.43_PM__8_-13d4baa2-7716-4311-a939-85a9d8e38c76.jpg",
  "my-fuel-oral-drops-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.21_PM__3_-f8203dfc-c1ad-432b-a32e-35542b43dd62.jpg",
  "my-vitality-oral-drops.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.29.43_PM__7_-de32fc8b-942f-430a-bb8e-d15bce4e756f.jpg",
  "my-vitality-oral-drops-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.21_PM__1_-f6a02fd5-99e6-4b7d-90a5-fe5623f28c83.jpg",
  "cordyceps-mushroom-powder.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.29.43_PM__3_-c860a092-da3d-4444-a207-6c80ca42c4e4.jpg",
  "cordyceps-mushroom-powder-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.20_PM__1_-4dbc8ae6-a470-4e99-8feb-15111854dba3.jpg",
  "lions-mane-mushroom-powder.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.29.43_PM__4_-84d60421-5f63-4254-99e8-7fd5ddde13cb.jpg",
  "lions-mane-mushroom-powder-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.20_PM__2_-3be482e6-3582-4eee-ba40-684c074d6ebf.jpg",
  "turkey-tail-mushroom-powder.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.29.44_PM__2_-c4c3a86c-2e45-4a7f-9368-f7926612662a.jpg",
  "turkey-tail-mushroom-powder-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.21_PM-0a8cd390-2f0d-46d2-b7e2-d2251364c8df.jpg",
  "function-mushroom-powder.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.29.43_PM__5_-85d636ca-c987-4226-b4c2-d5e15955bb97.jpg",
  "function-mushroom-powder-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.20_PM__3_-b71479f6-9d2b-4c10-b427-440b2348db03.jpg",
  "myco-dose.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-263851e8-847c-43c0-840a-5d6f0557e77b.jpg",
  "myco-mist.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-b82e1a2b-ac89-422d-960e-88dc5ac7f256.jpg",
  "collection-hero.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-9f2dd226-d950-4db7-9fe2-f8d2dc56f869.jpg",
};

const CATEGORY_COPIES: Record<string, string> = {
  "mushroom-capsules.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-09440039-98f1-456a-abb1-041724693360.jpg",
  "mushroom-oral-drops.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-ddfabcb3-fed4-4172-a528-f4ee983a40c7.jpg",
  "mushroom-powders.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-22e9a7e8-f7ec-4111-85f6-9febbd1e8e16.jpg",
  "beverages.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-263851e8-847c-43c0-840a-5d6f0557e77b.jpg",
  "myco-mist.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-b82e1a2b-ac89-422d-960e-88dc5ac7f256.jpg",
  "product-development.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-9f2dd226-d950-4db7-9fe2-f8d2dc56f869.jpg",
};

function install(map: Record<string, string>, destDir: string) {
  mkdirSync(destDir, { recursive: true });
  for (const [dest, src] of Object.entries(map)) {
    const from = join(ASSETS_DIR, src);
    const to = join(destDir, dest);
    if (!existsSync(from)) {
      console.error(`Missing source: ${from}`);
      process.exit(1);
    }
    copyFileSync(from, to);
    console.log(`Copied ${dest}`);
  }
}

if (!existsSync(ASSETS_DIR)) {
  console.error(`Assets folder not found: ${ASSETS_DIR}`);
  process.exit(1);
}

install(COPIES, PUBLIC_PRODUCTS);
install(CATEGORY_COPIES, PUBLIC_CATEGORIES);

execSync("tsx scripts/split-myco-mist-images.ts", { stdio: "inherit", cwd: process.cwd() });

console.log("Product images installed.");
