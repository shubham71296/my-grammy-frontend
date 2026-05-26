import { useCourseDialog } from "./course/useCourseDialog";
import CourseDialogEdit from "./course/CourseDialogEdit";
import CourseDialogDelete from "./course/CourseDialogDelete";

export default function CourseDialog() {
  const ctx = useCourseDialog();
  const { dialogInfo } = ctx;

  if (dialogInfo?.check === "edit_course") {
    return <CourseDialogEdit {...ctx} />;
  }
  if (dialogInfo?.check === "delete_course") {
    return <CourseDialogDelete {...ctx} />;
  }

  return null;
}
