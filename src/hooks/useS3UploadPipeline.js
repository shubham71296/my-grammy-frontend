import { useCallback, useState } from "react";
import {
  presignSmallUploads,
  uploadToPresignedUrl,
  uploadInBatches,
  uploadLargeFileMultipart,
} from "../utils/s3-helpers";
import { rollbackUploadedKeys } from "../utils/s3-rollback";

const SMALL_VIDEO_MAX = 50 * 1024 * 1024;

/**
 * Shared presign + batch image upload and small/large video upload with progress map.
 * Rolls back successfully uploaded S3 keys if a later file or batch fails.
 */
export function useS3UploadPipeline() {
  const [progressMap, setProgressMap] = useState({});

  const setProgress = useCallback((fileKey, percent) => {
    setProgressMap((prev) => ({ ...prev, [fileKey]: percent }));
  }, []);

  const clearProgress = useCallback(() => setProgressMap({}), []);

  const uploadImages = useCallback(
    async (files, folder, { batchSize = 4 } = {}) => {
      if (!files?.length) return [];

      const presigned = await presignSmallUploads(files, folder);
      const uploadedKeys = [];
      const results = [];

      try {
        for (let i = 0; i < presigned.length; i += batchSize) {
          const slice = presigned.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            slice.map(async (meta, idx) => {
              const fileIndex = i + idx;
              const file = files[fileIndex];
              const uploaded = await uploadToPresignedUrl(meta, file, (pct) =>
                setProgress(file.name, pct)
              );
              if (uploaded?.key) uploadedKeys.push(uploaded.key);
              return uploaded;
            })
          );
          results.push(...batchResults);
        }
        return results;
      } catch (err) {
        await rollbackUploadedKeys(uploadedKeys);
        throw err;
      }
    },
    [setProgress]
  );

  const uploadVideos = useCallback(
    async (
      files,
      folder,
      { smallBatchSize = 4, largeBatchSize = 3, smallMaxBytes = SMALL_VIDEO_MAX } = {}
    ) => {
      if (!files?.length) return [];

      const uploadedKeys = [];
      const uploaded = [];

      try {
        const smallFiles = files.filter((f) => f.size <= smallMaxBytes);
        const largeFiles = files.filter((f) => f.size > smallMaxBytes);

        if (smallFiles.length > 0) {
          const presigned = await presignSmallUploads(smallFiles, folder);
          for (let i = 0; i < presigned.length; i += smallBatchSize) {
            const slice = presigned.slice(i, i + smallBatchSize);
            const batchResults = await Promise.all(
              slice.map(async (meta, idx) => {
                const file = smallFiles[i + idx];
                const result = await uploadToPresignedUrl(meta, file, (pct) =>
                  setProgress(file.name, pct)
                );
                if (result?.key) uploadedKeys.push(result.key);
                return result;
              })
            );
            uploaded.push(...batchResults);
          }
        }

        if (largeFiles.length > 0) {
          for (const file of largeFiles) {
            const result = await uploadLargeFileMultipart(
              file,
              {
                partSize: 5 * 1024 * 1024,
                batchSize: 5,
                onProgress: (pct) => setProgress(file.name, pct),
              },
              folder
            );
            if (result?.key) uploadedKeys.push(result.key);
            uploaded.push(result);
          }
        }

        return uploaded;
      } catch (err) {
        await rollbackUploadedKeys(uploadedKeys);
        throw err;
      }
    },
    [setProgress]
  );

  const splitExistingAndNew = useCallback((fileValues) => {
    const list = Array.isArray(fileValues) ? fileValues : [];
    return {
      existing: list.filter((f) => f.isExisting),
      newFiles: list.filter((f) => !f.isExisting),
    };
  }, []);

  return {
    progressMap,
    setProgressMap,
    setProgress,
    clearProgress,
    uploadImages,
    uploadVideos,
    splitExistingAndNew,
    rollbackUploadedKeys,
  };
}
