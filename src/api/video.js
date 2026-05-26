import api from "./axios";

export const getVideoStreamUrl = async (videoKey, lectureId, token) => {
  const res = await api.get("/video/stream", {
    params: { lectureId, key: videoKey },
  });

  return res.data.url;
};
