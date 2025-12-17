// src/utils/s3-helpers.js
import axios from "axios";

/**
 * Presign multiple small uploads (PUT). Expects backend /api/upload/presign.
 * files: Array<File>
 * returns: Array of { key, url, uploadUrl, originalName, mimeType }
 */
export async function presignSmallUploads(files = [], folder) {
  if (!files || files.length === 0) return [];
  const payload = {
    files: files.map((f) => ({ name: f.name, type: f.type, folder })),
  };
  const res = await axios.post("/api/upload/presign", payload);
  return res.data.uploads || [];
}

/**
 * Upload a file to a presigned PUT URL (no progress)
 */
// export async function uploadToPresignedUrl(uploadMeta, file) {
//   const res = await fetch(uploadMeta.uploadUrl, {
//     method: "PUT",
//     headers: { "Content-Type": uploadMeta.mimeType || file.type || "application/octet-stream" },
//     body: file,
//   });
//   if (!res.ok) throw new Error(`Upload failed for ${file.name}`);
//   return {
//     key: uploadMeta.key,
//     url: uploadMeta.url,
//     originalName: uploadMeta.originalName || file.name,
//     mimeType: uploadMeta.mimeType || file.type,
//     size: file.size,
//   };
// }
export async function uploadToPresignedUrl(uploadMeta, file, onProgress) {
  const res = await axios.put(uploadMeta.uploadUrl, file, {
    headers: { "Content-Type": uploadMeta.mimeType || file.type },
    onUploadProgress: (e) => {
      if (e.total) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      }
    },
  });

  return {
    key: uploadMeta.key,
    //url: uploadMeta.url,
    ...(uploadMeta.url ? { url: uploadMeta.url } : {}),
    originalName: uploadMeta.originalName || file.name,
    mimeType: uploadMeta.mimeType || file.type,
    size: file.size,
  };
}


/* ------------------ Multipart helpers for large files (videos) ------------------ */

export async function startMultipart(file, folder) {
  const res = await axios.post("/api/upload/multipart/init", {
    fileName: file.name,
    fileType: file.type,
    folder,
  });
  return res.data;
}

export async function presignParts(key, uploadId, parts) {
  const res = await axios.post("/api/upload/multipart/presign", {
    key,
    uploadId,
    parts,
  });
  return res.data.uploads || [];
}

export async function completeMultipart(key, uploadId, parts) {
  const res = await axios.post("/api/upload/multipart/complete", {
    key,
    uploadId,
    parts,
  });
  return res.data;
}

export function splitFileToParts(file, partSize = 5 * 1024 * 1024) {
  const parts = [];
  let partNumber = 1;
  for (let start = 0; start < file.size; start += partSize) {
    const end = Math.min(start + partSize, file.size);
    parts.push({ PartNumber: partNumber++, blob: file.slice(start, end) });
  }
  return parts;
}

/* ------------------ Parallel multipart upload with retry ------------------ */

// export async function uploadPartsParallel(parts, presignedUrls, onProgress, batchSize = 4) {
//   let completed = 0;
//   const total = parts.length;

//   const tasks = parts.map((part) => {
//     const urlObj = presignedUrls.find(
//       (u) => Number(u.PartNumber) === Number(part.PartNumber)
//     );
//     if (!urlObj) throw new Error("Missing presigned URL for part " + part.PartNumber);

//     return async () => {
//       const res = await fetch(urlObj.uploadUrl, { method: "PUT", body: part.blob });
//       if (!res.ok) throw new Error(`Part upload failed: ${res.statusText}`);

//       const etag = res.headers.get("ETag") || res.headers.get("etag") || null;

//       completed++;
//       if (typeof onProgress === "function") {
//         const pct = Math.round((completed / total) * 100);
//         onProgress(pct);
//       }

//       return { PartNumber: part.PartNumber, ETag: etag };
//     };
//   });

//   return uploadInBatches(tasks, batchSize);
// }

export async function uploadPartsParallel(
  parts,
  presignedUrls,
  onProgress,
  batchSize = 4
) {
  const totalSize = parts.reduce((sum, p) => sum + p.blob.size, 0);

  // Track uploaded bytes for each part
  const partLoadedMap = {}; // { 1: 0, 2: 0, ... }

  const tasks = parts.map((part) => {
    const presigned = presignedUrls.find(
      (p) => Number(p.PartNumber) === Number(part.PartNumber)
    );
    if (!presigned) throw new Error("Missing presigned URL for part " + part.PartNumber);

    return async () => {
      return new Promise(async (resolve, reject) => {
        try {
          let lastLoaded = 0;

          const res = await axios.put(presigned.uploadUrl, part.blob, {
            headers: { "Content-Type": "application/octet-stream" },
            onUploadProgress: (evt) => {
              if (!evt.total) return;

              const current = evt.loaded;

              // update delta only
              const delta = current - lastLoaded;
              lastLoaded = current;

              // apply delta
              partLoadedMap[part.PartNumber] =
                (partLoadedMap[part.PartNumber] || 0) + delta;

              // global loaded
              const globalLoaded = Object.values(partLoadedMap).reduce(
                (a, b) => a + b,
                0
              );

              const percent = Math.floor((globalLoaded / totalSize) * 100);
              if (typeof onProgress === "function") onProgress(percent);
            },
          });

          // Must capture ETag
          let etag =
            res.headers["etag"] ||
            res.headers["ETag"] ||
            res.headers.get?.("ETag") ||
            null;

          if (!etag) {
            console.warn("⚠ Missing ETag for part", part.PartNumber);
          }

          resolve({
            PartNumber: part.PartNumber,
            ETag: etag.replace(/"/g, ""), // remove quotes for AWS
          });
        } catch (err) {
          reject(err);
        }
      });
    };
  });

  return uploadInBatches(tasks, batchSize);
}



/**
 * Full helper: upload a large file via multipart (parallel + retry)
 */
export async function uploadLargeFileMultipart(
  file,
  { partSize = 5 * 1024 * 1024, onProgress, batchSize = 4 } = {},
  folder
) {
  const init = await startMultipart(file, folder);
  if (!init?.key || !init?.uploadId) throw new Error("Multipart init failed");

  const parts = splitFileToParts(file, partSize);
  const presigned = await presignParts(init.key, init.uploadId, parts.length);

  // Parallel upload with retry
  const uploadedParts = await uploadPartsParallel(parts, presigned, onProgress, batchSize);

  const completed = await completeMultipart(init.key, init.uploadId, uploadedParts);
  //const location = completed.location || completed.resp?.Location || null;

  return {
    key: init.key,
    //url: location,
    ...(completed.url ? { url: completed.url } : {}),
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    //resp: completed,
  };
}

/* ------------------ Generic batch uploader with retry ------------------ */

export async function uploadInBatches(tasks, batchSize = 4) {
  const results = [];
  let currentIndex = 0;

  while (currentIndex < tasks.length) {
    const batch = tasks.slice(currentIndex, currentIndex + batchSize);
    const batchResults = await Promise.all(batch.map(taskWithRetry));
    results.push(...batchResults);
    currentIndex += batchSize;
  }

  return results;
}

async function taskWithRetry(task, retries = 3) {
  try {
    return await task();
  } catch (err) {
    if (retries === 0) throw err;
    await delay(500);
    return taskWithRetry(task, retries - 1);
  }
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
