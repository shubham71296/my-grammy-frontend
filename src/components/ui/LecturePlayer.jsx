import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getVideoStreamUrl } from "../../api/video";

export default function LecturePlayer({ videoKey }) {
  const { token } = useSelector((state) => state.auth);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoKey || !token) return;

    async function loadVideo() {
      try {
        setLoading(true);
        const url = await getVideoStreamUrl(videoKey, token);
        setVideoUrl(url);
      } catch (err) {
        console.error("Video load failed", err);
      } finally {
        setLoading(false);
      }
    }

    loadVideo();
  }, [videoKey, token]);

  if (loading) return <p>Loading video...</p>;
  if (!videoUrl) return <p>Video not available</p>;

  return (
    <video
      src={videoUrl}
      controls
      controlsList="nodownload"
      disablePictureInPicture
      style={{ width: "100%", maxHeight: "70vh" }}
    />
  );
}
