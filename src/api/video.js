// import axios from "axios";

// export const getVideoStreamUrl = async (videoKey, lectureId, token) => {
//   const res = await axios.get("/api/video/stream", {
//     params: { lectureId, key: videoKey },
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return res.data.url;
// };


import axios from "axios";
import api from "./axios";

export const getVideoStreamUrl = async (videoKey, lectureId, token) => {
  const res = await api.get("/video/stream", {
    params: { lectureId, key: videoKey }
  });

  return res.data.url;
};
