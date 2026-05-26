/** Normalize MongoDB id (string, ObjectId, or { _id }). */
export function normalizeMongoId(id) {
  if (id == null || id === "") return null;
  if (typeof id === "string") return id;
  if (typeof id === "object" && id._id != null) {
    return id._id.toString?.() ?? String(id._id);
  }
  return id.toString?.() ?? String(id);
}

/** Normalize cart line productId (string or populated object). */
export function getCartProductId(item) {
  if (!item?.productId) return null;
  return normalizeMongoId(item.productId);
}

export function isFreeWithInstrumentItem(item) {
  if (item?.productType !== "course_masters") return false;
  if (item.accessReason === "FREE_WITH_INSTRUMENT") return true;
  return Number(item.price) === 0 && Boolean(normalizeMongoId(item.linkedInstrumentId));
}

/** Lines that should appear in cart UI and count toward the navbar badge. */
export function getVisibleCartItems(items = []) {
  const instruments = items.filter((i) => i.productType === "instruments");
  const instrumentIds = new Set(
    instruments.map((i) => getCartProductId(i)).filter(Boolean)
  );

  return items.filter((item) => {
    if (item.productType === "instruments") return true;
    if (item.productType === "course_masters" && !isFreeWithInstrumentItem(item)) {
      return true;
    }
    if (isFreeWithInstrumentItem(item)) {
      const linked = normalizeMongoId(item.linkedInstrumentId);
      return linked && instrumentIds.has(linked);
    }
    return false;
  });
}

export function getCartBadgeCount(items = []) {
  return getVisibleCartItems(items).length;
}

export function getVisibleCartUnits(items = []) {
  return getVisibleCartItems(items).reduce(
    (sum, item) => sum + (item.qty || 1),
    0
  );
}
