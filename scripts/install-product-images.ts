/**
 * Copies client WhatsApp product photos into public/images/products (and categories).
 * Run: npx tsx scripts/install-product-images.ts
 */
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
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-61196a3f-df54-4451-b963-4c48ef75fb28.jpg",
  "cordyceps-capsules-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.20_PM__4_-43211f1c-7448-473c-ae81-6f4524555518.jpg",
  "lions-mane-capsules.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-cfc03311-8512-4bbb-abd3-7c639ef12faf.jpg",
  "lions-mane-capsules-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.20_PM__7_-7139029c-45d9-4ffc-8809-f531561f3a67.jpg",
  "turkey-tail-capsules.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-738f81bc-8ba2-4be6-9050-aa2fc8ea7572.jpg",
  "turkey-tail-capsules-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.21_PM-0a8cd390-2f0d-46d2-b7e2-d2251364c8df.jpg",
  "my-gut-capsules.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-bbfff1f2-88fc-48a2-ad5f-d7360385f438.jpg",
  "my-gut-capsules-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.20_PM__6_-9aeaf242-1308-4c23-ab78-2699bf223342.jpg",
  "my-focus-oral-drops.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-121e1ce3-49cb-426a-a028-7962a137f162.jpg",
  "my-focus-oral-drops-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.21_PM__2_-b9b3080d-563a-4af4-b49c-597e07204c0e.jpg",
  "my-fuel-oral-drops.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-41e3b465-ea19-44ab-8653-f93b5ade33fb.jpg",
  "my-fuel-oral-drops-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.21_PM__3_-f8203dfc-c1ad-432b-a32e-35542b43dd62.jpg",
  "my-vitality-oral-drops.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-7a38b544-4213-4471-8d35-d8933f8acba7.jpg",
  "my-vitality-oral-drops-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.21_PM__1_-f6a02fd5-99e6-4b7d-90a5-fe5623f28c83.jpg",
  "cordyceps-mushroom-powder.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-5f71a9f8-d6e2-4d05-b4ad-6c7f6a70ba92.jpg",
  "cordyceps-mushroom-powder-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.20_PM__1_-4dbc8ae6-a470-4e99-8feb-15111854dba3.jpg",
  "lions-mane-mushroom-powder.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-816f41b4-29a1-4256-b8b7-d941907f2e0e.jpg",
  "lions-mane-mushroom-powder-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.20_PM__2_-3be482e6-3582-4eee-ba40-684c074d6ebf.jpg",
  "turkey-tail-mushroom-powder.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-ea5286a3-b81e-4721-86bd-49350d5527d0.jpg",
  "turkey-tail-mushroom-powder-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.21_PM-0a8cd390-2f0d-46d2-b7e2-d2251364c8df.jpg",
  "function-mushroom-powder.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-8fa77754-055b-4c6a-bc99-cc8a1b9704ff.jpg",
  "function-mushroom-powder-marketing.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_WhatsApp_Image_2026-09-16_at_9.30.20_PM__3_-b71479f6-9d2b-4c10-b427-440b2348db03.jpg",
  "myco-dose.jpg":
    "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_ebc5ffe806adaa3a2c95226e80d64433_images_image-cbf5d16f-56b3-4ac4-8315-2732c90fd430.jpg",
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

console.log("Product images installed.");
