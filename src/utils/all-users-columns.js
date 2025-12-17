import { Delete, Edit, Visibility } from "@mui/icons-material";

export const menuOptions = [
    {
        _label: "Delete",
        _check: "delete_user",
        _icon: Delete,
        _dialogInfo: {
            title: "Delete User",
            content: "Are you sure want to delete the selected User? If yes then all the reference data will also be deleted!"
        }
    },
    {
        _label: "View",
        _check: "view_user",
        _icon: Visibility,
        _dialogInfo: {
            title: "User Info",
            content: ""
        }
    }
]

export const headCells = [
    {
        _col: 'first_name',
        _label: 'First Name',
    },
     {
        _col: 'last_name',
        _label: 'Last Name',
    },    
    {
        _col: 'phone_number',
        _label: 'Phone Number',
    },
    {
        _col: 'em',
        _label: 'Email',
    },
    {
        _col: 'address',
        _label: 'Address',
    },
    {
        _col: 'role',
        _label: 'Role',
    },
    {
        _col: 'temp_action',
        _label: 'Action',
    }
]