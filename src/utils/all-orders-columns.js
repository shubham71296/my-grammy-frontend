import { Eye } from "lucide-react";
import DynamicDate from "../components/ui/table/DynamicDate";
import DynamicChip from "../components/ui/table/DynamicChip";
import DynamicAmount from "../components/ui/table/DynamicAmount";

export const menuOptions = [
  {
    _label: "View",
    _icon: Eye,
    _navigateTo: "/admin/order",
  },
];

export const headCells = [
  {
    _col: "userEmail",
    _label: "User Email",
  },
  {
    _col: "amount",
    _label: "Amount",
    _comp: DynamicAmount,
  },
  {
    _col: "paymentStatus",
    _label: "Payment Status",
    _comp: DynamicChip,
  },
  {
    _col: "createdAt",
    _label: "Created At",
    _comp: DynamicDate,
  },
  {
    _col: "temp_action",
    _label: "Action",
  },
];
