export const BRAND = {
  name: "Fungtional Wellness",
  tagline: "Engineered for Every Move",
  headline: "Fungtional living made simple",
  email: "rico@fungtionallabs.com",
  salesEmail: "sales@fungtionallabs.com",
  phone: "702-826-7426",
  website: "www.fungtionalwellness.com",
} as const;

export const COLORS = {
  obsidian: "#080A09",
  carbon: "#111411",
  warmWhite: "#F5F3EC",
  softIvory: "#EDE9DE",
  deepForest: "#143D2D",
  botanical: "#2D6A4F",
  electric: "#55C878",
  burntOrange: "#F05A28",
  metallicSilver: "#C8C9C7",
} as const;

export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export const MAX_UPLOAD_SIZE = 8 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const BENEFITS = [
  "Energy",
  "Focus",
  "Immunity",
  "Gut Health",
  "Stress Support",
  "Recovery",
  "Overall Wellness",
] as const;

export const DEFAULT_DISCLAIMER =
  "These statements have not been evaluated for the treatment, prevention or cure of disease. Product information is provided for general informational purposes and is not a substitute for professional medical advice.";

export const DEFAULT_ANNOUNCEMENT =
  "100% FULL FRUITING BODY • NO MYCELIUM • NO FILLERS";
