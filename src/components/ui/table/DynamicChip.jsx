import { Badge } from "../tw/Badge";

const statusMap = {
  pending: { label: "Pending", color: "warning" },
  paid: { label: "Paid", color: "success" },
  failed: { label: "Failed", color: "error" },
  cancelled: { label: "Cancelled", color: "default" },
};

const DynamicChip = ({ val }) => {
  const status = val?.toString().toLowerCase() || "";
  const props =
    statusMap[status] || { label: val || "N/A", color: "default" };

  return (
    <Badge color={props.color} className="text-[0.7rem] font-bold normal-case shadow-sm">
      {props.label}
    </Badge>
  );
};

export default DynamicChip;
