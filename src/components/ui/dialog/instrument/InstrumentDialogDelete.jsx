import { Trash2, X } from "lucide-react";
import { Button } from "../../tw/Button";
import { Spinner } from "../../tw/Spinner";
import {
  DialogHeaderBar,
  DeleteConfirmBody,
  ModalFooter,
} from "../dialogLayout";

export default function InstrumentDialogDelete({
  data,
  dialogInfo,
  loading,
  handleClose,
  handleDelete,
}) {
  const title = data.instrument_title || "this instrument";

  return (
    <>
      <DialogHeaderBar
        icon={Trash2}
        variant="delete"
        title={`Delete — ${title}`}
        subtitle="Permanent removal"
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
        message={dialogInfo?.content || "This action cannot be undone."}
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
              Deleting…
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" aria-hidden />
              Delete permanently
            </>
          )}
        </Button>
      </ModalFooter>
    </>
  );
}
