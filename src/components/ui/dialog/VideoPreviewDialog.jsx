import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AlertCircle, Eye } from "lucide-react";
import { closeDialog } from "../../../features/ui/uiSlice";
import { getVideoStreamUrl } from "../../../api/video";
import { Button } from "../tw/Button";
import { Spinner } from "../tw/Spinner";
import { DialogHeaderBar, ModalBody } from "./dialogLayout";

export default function VideoPreviewDialog() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);

  const videoKey = selectedData?.videoKey;
  const lectureId = selectedData?.lectureId;
  const previewTitle = selectedData.title;

  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleClose = () => dispatch(closeDialog());

  useEffect(() => {
    if (!videoKey || !lectureId || !token) return;

    async function loadVideo() {
      try {
        setLoading(true);
        const url = await getVideoStreamUrl(videoKey, lectureId, token);
        setVideoUrl(url);
      } catch (err) {
        console.error("Video load failed", err);
        const status = err?.response?.status;
        const msg = err?.response?.data?.msg;

        if (status === 403) {
          setErrorMsg(msg || "You are not allowed to watch this video");
        } else if (status === 401) {
          setErrorMsg("Session expired. Please login again.");
        } else {
          setErrorMsg("Failed to load video. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadVideo();
  }, [videoKey, lectureId, token]);

  if (dialogInfo?.check !== "view_video") return null;

  return (
    <>
      <DialogHeaderBar
        icon={Eye}
        variant="view"
        title={previewTitle}
        onClose={handleClose}
      />
      <ModalBody className="bg-gradient-to-b from-slate-50/30 to-white">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Spinner size="lg" />
            <p className="text-sm text-slate-500">Loading video…</p>
          </div>
        )}

        {!loading && errorMsg && (
          <div className="flex justify-center py-4">
            <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-red-50 to-red-100 p-6 text-center shadow-lg">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-red-700">Access Denied</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {errorMsg}
              </p>
              <Button className="mt-4" variant="danger" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}

        {!loading && videoUrl && (
          <div className="flex max-h-[75vh] items-center justify-center overflow-hidden rounded-2xl bg-black/95 p-2 ring-1 ring-slate-800">
            <video
              src={videoUrl}
              controls
              autoPlay
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              className="max-h-[70vh] w-[90%] max-w-3xl rounded-xl shadow-md"
            />
          </div>
        )}
      </ModalBody>
    </>
  );
}
