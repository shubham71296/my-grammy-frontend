import React from "react";
import { Typography, Button } from "@mui/material";

function InputFile({
  _name,
  _value,
  _helperText,
  _errorMsg,
  onChange,
  _style = {
    _typography: {},
  },
  _elementSize = "small",
  _disabled,
  _mandatory,
  _multiple = false,
}) {
  const isError = Boolean(_errorMsg);

  return (
    <div>
      <Typography variant="subtitle2" sx={_style._typography}>
        {_name} {_mandatory && <span style={{ color: "red" }}>*</span>}&nbsp;
      </Typography>

      <Button
        variant="outlined"
        component="label"
        size={_elementSize}
        disabled={_disabled}
        sx={{ width: "100%", justifyContent: "flex-start" }}
      >
       
          Choose file
        <input
          hidden
          type="file"
          multiple={_multiple}
          onChange={onChange}
        />
      </Button>

      <Typography
        variant="caption"
        color={isError ? "error" : "textSecondary"}
        display="block"
        sx={{ mt: 0.5 }}
      >
        {isError ? _errorMsg : _helperText}
      </Typography>
    </div>
  );
}

export default InputFile;
