import { useSelector, useDispatch } from "react-redux";
import { Dialog } from "@mui/material";
import { closeDialog } from "../../../features/ui/uiSlice";
import InstrumentDialog from "./InstrumentDialog";
import FilePreviewDialog from "./FilePreviewDialog";
import LectureDialog from "./LectureDialog";
import CourseDialog from "./CourseDialog";
import VideoPreviewDialog from "./VideoPreviewDialog";
import UserDialog from "./UserDialog";
import OrderDialog from "./OrderDialog";
import { useEffect, useState } from "react";


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

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={isLocked}
      PaperProps={{
        sx: {
          pointerEvents: isLocked ? "none" : "auto",
          width: "100%",
          m: { xs: 1, sm: 2 },   
          maxHeight: "90vh",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: isLocked
            ? "rgba(0,0,0,0.35)" 
            : "rgba(0,0,0,0.25)",
          pointerEvents: isLocked ? "none" : "auto",  
        },
      }}
    >
      {dialogInfo.check === "view_instrument" && <InstrumentDialog />}
      {dialogInfo.check === "delete_instrument" && <InstrumentDialog />}
      {dialogInfo.check === "edit_instrument" && <InstrumentDialog />}

      {dialogInfo.check === "view_img_video" && <FilePreviewDialog />}

      {dialogInfo.check === "view_video" && <VideoPreviewDialog />}
      
      {dialogInfo.check === "edit_lecture" && <LectureDialog />}
      {dialogInfo.check === "delete_lecture" && <LectureDialog />}

      {dialogInfo.check === "edit_course" && <CourseDialog />}
      {dialogInfo.check === "delete_course" && <CourseDialog />}

      {dialogInfo.check === "view_user" && <UserDialog />}
      {dialogInfo.check === "delete_user" && <UserDialog />}

      {dialogInfo.check === "view_order" && <OrderDialog />}
    </Dialog>
  );
}
