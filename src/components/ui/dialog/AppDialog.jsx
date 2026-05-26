import { lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { closeDialog } from "../../../features/ui/uiSlice";
import { Modal } from "../tw/Modal";
import { Spinner } from "../tw/Spinner";

const InstrumentDialog = lazy(() => import("./InstrumentDialog"));
const FilePreviewDialog = lazy(() => import("./FilePreviewDialog"));
const LectureDialog = lazy(() => import("./LectureDialog"));
const CourseDialog = lazy(() => import("./CourseDialog"));
const VideoPreviewDialog = lazy(() => import("./VideoPreviewDialog"));
const UserDialog = lazy(() => import("./UserDialog"));
const LoginRequiredDialog = lazy(() => import("./LoginRequiredDialog"));

function DialogFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-8 py-16">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-violet-100">
        <Spinner size="lg" />
      </div>
      <p className="text-sm font-semibold text-slate-600">Loading dialog…</p>
    </div>
  );
}

export default function AppDialog() {
  const dispatch = useDispatch();
  const { openDialog, dialogInfo } = useSelector((state) => state.ui.dialog);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const handler = (e) => setIsLocked(e.detail);
    window.addEventListener("dialogLoading", handler);
    return () => window.removeEventListener("dialogLoading", handler);
  }, []);

  const handleClose = () => {
    if (isLocked) return;
    dispatch(closeDialog());
  };

  const check = dialogInfo?.check;

  const modalMaxWidth =
    check === "edit_instrument"
      ? "max-w-6xl"
      : check === "edit_lecture"
        ? "max-w-4xl"
        : "max-w-3xl";
  const modalMaxHeight =
    check === "edit_instrument" || check === "edit_lecture"
      ? "max-h-[calc(100dvh-0.75rem)] sm:max-h-[min(95vh,960px)]"
      : undefined;

  const isFullscreenImage = check === "view_img_video";

  const renderBody = () => {
    if (!check) return null;
    if (["delete_instrument", "edit_instrument"].includes(check)) {
      return <InstrumentDialog />;
    }
    if (isFullscreenImage) return <FilePreviewDialog />;
    if (check === "view_video") return <VideoPreviewDialog />;
    if (["edit_lecture", "delete_lecture"].includes(check)) return <LectureDialog />;
    if (["edit_course", "delete_course"].includes(check)) return <CourseDialog />;
    if (check === "delete_user") return <UserDialog />;
    if (check === "guest_login_required") return <LoginRequiredDialog />;
    return null;
  };

  if (isFullscreenImage) {
    return openDialog ? (
      <Suspense fallback={null}>
        <FilePreviewDialog />
      </Suspense>
    ) : null;
  }

  return (
    <Modal
      open={openDialog}
      onClose={handleClose}
      lockClose={isLocked}
      maxWidth={modalMaxWidth}
      maxHeight={modalMaxHeight}
    >
      <Suspense fallback={<DialogFallback />}>{renderBody()}</Suspense>
    </Modal>
  );
}
