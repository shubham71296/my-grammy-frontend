import { memo } from "react";

function DynamicRowComponent({ val, i2, headCells }) {
  const cell = headCells[i2];
  if (cell?._comp) {
    const Comp = cell._comp;
    return <Comp val={val} />;
  }
  return <>{val}</>;
}

export default memo(DynamicRowComponent);
