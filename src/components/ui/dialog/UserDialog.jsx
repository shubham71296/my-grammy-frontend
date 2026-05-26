import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, X } from "lucide-react";
import { closeDialog } from "../../../features/ui/uiSlice";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { Button } from "../tw/Button";
import { Spinner } from "../tw/Spinner";
import {
  DialogHeaderBar,
  DeleteConfirmBody,
  ModalFooter,
} from "./dialogLayout";

export default function UserDialog() {
  const dispatch = useDispatch();
  const { selectedData, dialogInfo } = useSelector((state) => state.ui.dialog);
  const [loading, setLoading] = useState(false);

  const user = selectedData || {};

  const handleClose = () => dispatch(closeDialog());

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  const handleDelete = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await api.delete(`/admin/deleteuser/${user._id}`);
      dispatch(closeDialog());
      toast.success(response.data.msg);
      return response;
    } catch (err) {
      const errorMsg = err?.response?.data?.msg || "Something went wrong!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("dialogLoading", { detail: loading })
    );
  }, [loading]);

  if (dialogInfo?.check === "delete_user") {
    return (
      <>
        <DialogHeaderBar
          icon={Trash2}
          variant="delete"
          title={`Delete user — ${fullName || "account"}`}
          subtitle="This cannot be undone"
          onClose={handleClose}
        />
        <DeleteConfirmBody
          icon={Trash2}
          title="Are you sure you want to delete this user?"
          message="All data linked to this account will be permanently removed."
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

  return null;
}
