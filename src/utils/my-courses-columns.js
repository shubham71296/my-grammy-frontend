import { Pencil, Trash2, Eye } from "lucide-react";
import DynamicImagePreview from "../components/ui/table/DynamicImagePreview";
import DynamicVideoPreview from "../components/ui/table/DynamicVideoPreview";

export const menuOptions = [
  {
    _label: "Edit",
    _check: "edit_course",
    _icon: Pencil,
    _dialogInfo: {
      title: "",
      content: "",
    },
  },
  {
    _label: "Delete",
    _check: "delete_course",
    _icon: Trash2,
    _dialogInfo: {
      title: "Delete Course",
      content:
        "Are you sure want to delete the selected Course? If yes then all the reference data will also be deleted!",
    },
  },
  {
    _label: "View",
    _check: "view_course",
    _icon: Eye,
    _dialogInfo: {
      title: "Course Info",
      content: "",
    },
  },
];

export const headCells = [
  {
    _col: "instrument",
    _label: "Course For Instrument",
  },
  {
    _col: "course_title",
    _label: "Course Title",
  },
  {
    _col: "course_description",
    _label: "Course Description",
  },
  {
    _col: "course_price",
    _label: "Course Price",
  },
  {
    _col: "course_video",
    _label: "Course Video",
    _comp: DynamicVideoPreview,
  },
  {
    _col: "thumbnail_image",
    _label: "Thumbnail image",
    _comp: DynamicImagePreview,
  },
  {
    _col: "temp_action",
    _label: "Action",
  },
];
