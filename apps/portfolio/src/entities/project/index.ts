export * from "./model/types";
export * from "./model/repository";
export * from "./model/queries";
export * from "./model/catalog";
export * from "./utils";

// Re-export utils for convenience
export {
  getThumbnailPath,
  getThumbnailAspectRatio,
  getFallbackThumbnail,
} from "../../utils/thumbnail";
export {
  formatProjectName,
  normalizeTags,
  normalizeBoolean,
  normalizeNumber,
} from "../../utils/normalize";
