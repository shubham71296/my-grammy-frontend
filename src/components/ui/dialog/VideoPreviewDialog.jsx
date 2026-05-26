import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AlertCircle, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { closeDialog } from "../../../features/ui/uiSlice";
import { getVideoStreamUrl } from "../../../api/video";
import { Button } from "../tw/Button";
import { Spinner } from "../tw/Spinner";
import { DialogHeaderBar, ModalBody } from "./dialogLayout";

export default function VideoPreviewDialog() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);

  const playlist =
    Array.isArray(selectedData?.playlist) && selectedData.playlist.length > 0
      ? selectedData.playlist
      : [
          {
            lectureId: selectedData?.lectureId,
            videoKey: selectedData?.videoKey,
            title: selectedData?.title,
          },
        ];

  const [activeIndex, setActiveIndex] = useState(selectedData?.currentIndex || 0);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const activeLecture = playlist[activeIndex] || playlist[0] || {};
  const videoKey = activeLecture?.videoKey;
  const lectureId = activeLecture?.lectureId;
  const previewTitle = activeLecture?.title || selectedData?.title || "Lecture preview";
  const hasMultipleVideos = playlist.length > 1;
  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < playlist.length - 1;

  const handleClose = () => dispatch(closeDialog());
  const goPrevious = () => setActiveIndex((current) => Math.max(0, current - 1));
  const goNext = () =>
    setActiveIndex((current) => Math.min(playlist.length - 1, current + 1));

  useEffect(() => {
    setActiveIndex(selectedData?.currentIndex || 0);
  }, [selectedData?.currentIndex, selectedData?.lectureId]);

  useEffect(() => {
    if (!videoKey || !lectureId || !token) return;

    async function loadVideo() {
      try {
        setLoading(true);
        setErrorMsg("");
        setVideoUrl("");
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
        wrapTitle
      />
      <ModalBody className="bg-gradient-to-b from-slate-50/30 to-white px-3 py-3 sm:px-6 sm:py-6">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Spinner size="lg" />
            <p className="text-sm text-slate-500">Loading video…</p>
          </div>
        )}

        {hasMultipleVideos && (
          <div className="mb-3 overflow-hidden rounded-[1.35rem] border border-brand-100 bg-gradient-to-r from-brand-50 via-white to-indigo-50 shadow-sm ring-1 ring-brand-100/70 sm:mb-4">
            <div className="flex items-center gap-2 p-2.5 sm:p-3">
              <button
                type="button"
                onClick={goPrevious}
                disabled={!canGoPrevious}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-white text-brand-700 shadow-sm transition hover:-translate-x-0.5 hover:border-brand-200 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-x-0 sm:h-11 sm:w-11"
                aria-label="Previous lecture"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0 flex-1 rounded-2xl bg-white/80 px-3 py-2 text-center ring-1 ring-white/80">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-500">
                  Lecture {activeIndex + 1} of {playlist.length}
                </p>
                <p className="mx-auto mt-1 line-clamp-2 max-w-md text-sm font-extrabold leading-snug text-navy">
                  {previewTitle}
                </p>
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-white text-brand-700 shadow-sm transition hover:translate-x-0.5 hover:border-brand-200 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-x-0 sm:h-11 sm:w-11"
                aria-label="Next lecture"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
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
          <div className="mx-auto flex w-full max-w-4xl items-center justify-center overflow-hidden rounded-[1.35rem] bg-black/95 p-1.5 ring-1 ring-slate-800 sm:rounded-2xl sm:p-2">
            <video
              src={videoUrl}
              controls
              autoPlay
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              className="max-h-[calc(100dvh-11rem)] max-w-full rounded-2xl object-contain shadow-md sm:max-h-[70vh]"
            />
          </div>
        )}
      </ModalBody>
    </>
  );
}
