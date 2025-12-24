import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openDialogAction } from "../../../features/ui/uiSlice";

function DynamicOption({
  selectedData,
  _label,
  _check,
  _icon,
  MenuItem,
  _dialogInfo,
  handleClose,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    handleClose();
    let dialogInfo = { ..._dialogInfo, check: _check };
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData,
        dialogInfo,
      })
    );
  };

  return (
    <MenuItem
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        paddingY: 1,
        paddingX: 2,
        borderRadius: 1.5,
        transition: "0.2s",
        fontSize: "0.925rem",
        "&:hover": {
          backgroundColor: "primary.main",
          color: "#fff",
          "& svg": {
            color: "#fff",
          },
        },
      }}
    >
      <_icon style={{ fontSize: 20 }} />
      <span>{_label}</span>
    </MenuItem>
  );
}

export default DynamicOption;
