import { formatDateDMY } from "../../../utils/formatDate";

const DynamicDate = ({ val }) => {
  const formattedDate = formatDateDMY(val);

  return (
    <span className="text-sm font-medium text-slate-600">{formattedDate}</span>
  );
};

export default DynamicDate;
