import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openDialogAction } from "../../../features/ui/uiSlice";
import { DropdownItem } from "../tw/Dropdown";

export default function DynamicOption({
  selectedData,
  _label,
  _check,
  _icon: Icon,
  _dialogInfo,
  _navigateTo,
  handleClose,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    handleClose?.();
    if (_navigateTo && selectedData?._id) {
      const path =
        typeof _navigateTo === "function"
          ? _navigateTo(selectedData)
          : `${_navigateTo}/${selectedData._id}`;
      navigate(path, { state: { row: selectedData } });
      return;
    }
    dispatch(
      openDialogAction({
        openDialog: true,
        selectedData,
        dialogInfo: { ..._dialogInfo, check: _check },
      })
    );
  };

  return (
    <DropdownItem
      onClick={handleClick}
      className="gap-2 transition hover:bg-brand-600 hover:text-white [&_svg]:text-slate-500 [&_svg]:hover:text-white"
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span>{_label}</span>
    </DropdownItem>
  );
}
