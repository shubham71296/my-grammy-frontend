import { useLectureDialog } from "./lecture/useLectureDialog";
import LectureDialogEdit from "./lecture/LectureDialogEdit";
import LectureDialogDelete from "./lecture/LectureDialogDelete";

export default function LectureDialog() {
  const ctx = useLectureDialog();
  const { dialogInfo } = ctx;

  if (dialogInfo?.check === "edit_lecture") {
    return <LectureDialogEdit {...ctx} />;
  }
  if (dialogInfo?.check === "delete_lecture") {
    return <LectureDialogDelete {...ctx} />;
  }

  return null;
}
