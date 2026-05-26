import { truncate } from "../../../utils/common-util";

function DynamicDescription({ val }) {
  return <span className="text-sm text-slate-700">{truncate(val, 35)}</span>;
}

export default DynamicDescription;
