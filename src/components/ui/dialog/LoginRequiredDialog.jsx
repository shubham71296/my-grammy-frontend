import { Lock, LogIn, X } from "lucide-react";
import { closeDialog } from "../../../features/ui/uiSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../tw/Button";
import {
  DialogHeaderBar,
  DialogNotice,
  ModalBody,
  ModalFooter,
} from "./dialogLayout";

export default function LoginRequiredDialog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => dispatch(closeDialog());

  return (
    <>
      <DialogHeaderBar
        icon={Lock}
        variant="lock"
        title="Login required"
        subtitle="Sign in to continue"
        onClose={handleClose}
      />
      <ModalBody>
        <DialogNotice icon={Lock} title="You need to be logged in">
          Please sign in to add items to your cart, checkout, or access purchased
          courses.
        </DialogNotice>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" fullWidth className="sm:w-auto" onClick={handleClose}>
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          fullWidth
          className="sm:w-auto inline-flex items-center gap-2"
          onClick={() => {
            dispatch(closeDialog());
            navigate("/login");
          }}
        >
          <LogIn className="h-4 w-4" />
          Login now
        </Button>
      </ModalFooter>
    </>
  );
}
