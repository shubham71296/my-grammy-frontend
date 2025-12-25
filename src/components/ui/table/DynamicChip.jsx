import React from "react";
import Chip from "@mui/material/Chip";

const DynamicChip = ({ val }) => {
  const status = val?.toString().toLowerCase() || "";

  const defaultStatusMap = {
    pending: {
      label: "Pending",
      color: "warning",
      variant: "filled",
    },
    paid: {
      label: "Paid",
      color: "success",
      variant: "filled",
    },
    failed: {
      label: "Failed",
      color: "error",
      variant: "filled",
    },
  };

  const chipProps =
    defaultStatusMap[status] || {
      label: val || "N/A",
      color: "default",
      variant: "outlined",
    };

  return (
    <Chip
      {...chipProps}
      size="small"
      sx={{
        fontSize: "0.7rem",
        height: 20,
        textTransform: "capitalize",
        "& .MuiChip-label": {
          padding: "0 6px",
        },
      }}
    />
  );
};

export default DynamicChip;
