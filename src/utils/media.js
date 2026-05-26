import { IMAGE_PLACEHOLDER } from "./image-constants";

/** First file url from instrument_images / thumbnail_image (handles legacy nested arrays). */
export const getFirstMediaUrl = (files, fallback = IMAGE_PLACEHOLDER) => {
  if (!Array.isArray(files) || files.length === 0) return fallback;
  let file = files[0];
  if (Array.isArray(file)) file = file[0];
  return file?.url || fallback;
};
