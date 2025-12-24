import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

function InputText({
  _name,
  _type,
  _value,
  _placeholder,
  _helperText,
  _errorMsg,
  onChange,
  _style = {
    _typography: {},
  },
  _elementSize = "",
  _disabled,
  _mandatory,
  _options,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isError = Boolean(_errorMsg);
  const isMultiline = _options?.multiline === true;

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Typography
        variant="subtitle2"
        sx={{
          fontSize: { xs: "0.75rem", sm: "0.85rem" },
          ..._style._typography,
        }}
      >
        {_name} {_mandatory && <span style={{ color: "red" }}>*</span>}&nbsp;
      </Typography>
      <TextField
        size={_elementSize}
        fullWidth
        type={
          isMultiline
            ? undefined
            : _type === "password"
            ? showPassword
              ? "text"
              : "password"
            : _type
        }
        disabled={_disabled}
        placeholder={_placeholder}
        name={_name}
        value={_value}
        onChange={onChange}
        helperText={isError ? _errorMsg : _helperText}
        error={isError}
        {..._options}
        FormHelperTextProps={{
          sx: {
            marginLeft: 0,
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
          },
        }}
        sx={{
          mb: 1,
          "& .MuiInputBase-input": {
            padding: { xs: "10px 12px", sm: "12px 14px" },
            fontSize: { xs: "0.9rem", sm: "1rem" },
          },
          "& .MuiIconButton-root > *": {
            fontSize: { xs: 16, sm: 18 },
          },
        }}
        InputProps={{
          endAdornment:
            _type === "password" ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ) : null,
        }}
      />
    </>
  );
}

export default InputText;
