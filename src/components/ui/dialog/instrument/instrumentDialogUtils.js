export const formatInstrumentCurrency = (val) => {
  if (val === undefined || val === null || val === "") return "—";
  const n = Number(val);
  if (Number.isNaN(n)) return val;
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
};

export const formatInstrumentDate = (createdAt) => {
  if (!createdAt) return "—";
  try {
    return new Date(createdAt).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return createdAt;
  }
};

/** Flatten instrument_images (nested arrays, strings, objects) into gallery items with urls. */
export const normalizeInstrumentImages = (data) => {
  const raw = data?.instrument_images;
  if (!raw) return [];

  const flat = Array.isArray(raw) ? raw.flat(Infinity) : [raw];

  return flat
    .map((item, index) => {
      if (!item) return null;
      if (typeof item === "string") {
        return { key: `str-${index}`, url: item, originalName: "image" };
      }
      if (item instanceof File) return null;
      const url = item.url || item.base64 || item.path;
      if (!url) return null;
      return {
        key: item.key || item.url || `img-${index}`,
        url,
        originalName: item.originalName || item.key || `Image ${index + 1}`,
      };
    })
    .filter(Boolean);
};
