import { Pencil, Trash2, Eye } from "lucide-react";
import DynamicImagePreview from "../components/ui/table/DynamicImagePreview";
import DynamicAmount from "../components/ui/table/DynamicAmount";
import DynamicDescription from "../components/ui/table/DynamicDescription";

export const menuOptions = [
  {
    _label: "Edit",
    _check: "edit_instrument",
    _icon: Pencil,
    _dialogInfo: {
      title: "",
      content: "",
    },
  },
  {
    _label: "Delete",
    _check: "delete_instrument",
    _icon: Trash2,
    _dialogInfo: {
      title: "Delete Instrument",
      content:
        "Are you sure want to delete the selected Instrument? If yes then all the reference data will also be deleted!",
    },
  },
  {
    _label: "View",
    _icon: Eye,
    _navigateTo: "/admin/myinstrument",
  },
];

export const headCells = [
  {
    _col: "instrument_title",
    _label: "Instrument Title",
  },
  {
    _col: "instrument_price",
    _label: "Instrument Price",
    _comp: DynamicAmount,
  },
  {
    _col: "instrurment_description",
    _label: "Instrument Description",
    _comp: DynamicDescription,
  },
  {
    _col: "instrument_images",
    _label: "Instrument Images",
    _comp: DynamicImagePreview,
  },
  {
    _col: "temp_action",
    _label: "Action",
  },
];
