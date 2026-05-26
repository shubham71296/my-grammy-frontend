import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { openDialogAction } from "../features/ui/uiSlice";

export function useGuestLoginDialog() {
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(
      openDialogAction({
        openDialog: true,
        dialogInfo: { check: "guest_login_required" },
      })
    );
  }, [dispatch]);
}
