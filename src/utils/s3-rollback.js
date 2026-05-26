import api from "../api/axios";

/** Best-effort delete of keys uploaded before a failed save. */
export async function rollbackUploadedKeys(keys = []) {
  const unique = [...new Set(keys.filter(Boolean))];
  if (unique.length === 0) return;
  try {
    await api.post("/upload/rollback", { keys: unique });
  } catch (err) {
    console.warn("S3 rollback failed:", err?.response?.data?.msg || err.message);
  }
}
