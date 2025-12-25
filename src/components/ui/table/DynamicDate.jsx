import React from "react";
import moment from "moment";

const DynamicDate = ({ val }) => {
  const formattedDate = val
    ? moment(val).format("DD/MM/YYYY")
    : "Invalid Date";

  return (
    <span
      style={{
        fontWeight: 500,
        fontSize: "0.9rem",
        color: "#1e293b",
      }}
    >
      {formattedDate}
    </span>
  );
};

export default DynamicDate;
