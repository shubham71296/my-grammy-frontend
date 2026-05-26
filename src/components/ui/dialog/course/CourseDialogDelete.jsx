import { Trash2, X } from "lucide-react";
import { Button } from "../../tw/Button";
import { Spinner } from "../../tw/Spinner";
import {
  DialogHeaderBar,
  DeleteConfirmBody,
  ModalFooter,
} from "../dialogLayout";

export default function CourseDialogDelete({
  data,
  dialogInfo,
  loading,
  handleClose,
  handleDelete,
}) {
  const title = data?.course_title;

  return (
    <>
      <DialogHeaderBar
        icon={Trash2}
        variant="delete"
        title={`Delete — ${title}`}
        subtitle="Removes all lectures & media"
        onClose={handleClose}
      />
      <DeleteConfirmBody
        icon={Trash2}
        title={
          <>
            Are you sure you want to permanently delete{" "}
            <span className="capitalize">{title}</span>?
          </>
        }
        message={
          dialogInfo?.content ||
          "This action cannot be undone. All lectures and videos will be removed."
        }
      />
      <ModalFooter>
        <Button variant="outline" onClick={handleClose} disabled={loading}>
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={loading}
          onClick={handleDelete}
          className="inline-flex items-center gap-2"
        >
          {loading ? (
            <>
              <Spinner size="sm" className="border-white/30 border-t-white" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" aria-hidden />
              Delete Permanently
            </>
          )}
        </Button>
      </ModalFooter>
    </>
  );
}
