import { Delete, Edit, Visibility } from "@mui/icons-material";
import DynamicDate from "../components/ui/table/DynamicDate";
import DynamicChip from "../components/ui/table/DynamicChip";
import DynamicAmount from "../components/ui/table/DynamicAmount";

export const menuOptions = [
    // {
    //     _label: "Delete",
    //     _check: "delete_user",
    //     _icon: Delete,
    //     _dialogInfo: {
    //         title: "Delete User",
    //         content: "Are you sure want to delete the selected User? If yes then all the reference data will also be deleted!"
    //     }
    // },
    {
        _label: "View",
        _check: "view_order",
        _icon: Visibility,
        _dialogInfo: {
            title: "Order Info",
            content: ""
        }
    }
]

export const headCells = [
    {
        _col: 'userEmail',
        _label: 'User Email',
    },
     {
        _col: 'amount',
        _label: 'Amount',
        _comp: DynamicAmount
    },    
    {
        _col: 'paymentStatus',
        _label: 'Payment Status',
        _comp: DynamicChip
    },
    {
        _col: 'createdAt',
        _label: 'Created At',
        _comp: DynamicDate,
    },
    {
        _col: 'temp_action',
        _label: 'Action',
    }
]