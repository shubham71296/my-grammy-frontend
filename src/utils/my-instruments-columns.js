import { Delete, Edit, Visibility } from "@mui/icons-material";
import DynamicImagePreview from "../components/ui/table/DynamicImagePreview";
// import { MdEditNote, MdDeleteOutline, MdRemoveRedEye } from "react-icons/md";


export const menuOptions = [
    {
        _label: "Edit",
        _check: "edit_instrument",
        _icon: Edit,
        _dialogInfo: {
            title: "",
            content: ""
        }
    },
    {
        _label: "Delete",
        _check: "delete_instrument",
        _icon: Delete,
        _dialogInfo: {
            title: "Delete Instrument",
            content: "Are you sure want to delete the selected Instrument? If yes then all the reference data will also be deleted!"
        }
    },
    {
        _label: "View",
        _check: "view_instrument",
        _icon: Visibility,
        _dialogInfo: {
            title: "Instrument Info",
            content: ""
        }
    }
]

export const headCells = [
    {
        _col: 'instrument_title',
        _label: 'Instrument Title',
    },
     {
        _col: 'instrument_price',
        _label: 'Instrument Price',
    },    
    {
        _col: 'instrurment_description',
        _label: 'Instrument Description',
    },
    {
        _col: 'instrument_images',
        _label: 'Instrument Images',
        _comp: DynamicImagePreview
    },
    {
        _col: 'temp_action',
        _label: 'Action',
    }
]