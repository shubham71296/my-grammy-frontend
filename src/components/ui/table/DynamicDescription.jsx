import React from "react";
import { Box } from "@mui/material";
import { truncate } from "../../../utils/common-util";

function DynamicDescription({ val }) {
  
  return (
    <Box>
      {truncate(val, 35)}
    </Box>
  );
}

export default DynamicDescription;
