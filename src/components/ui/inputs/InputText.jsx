import { TextField, Typography } from '@mui/material';
import React from 'react';

function InputText({
  _name,
  _type,
  _value,
  _placeholder,
  _helperText,
  _errorMsg,
  onChange,
  _style = {
    _typography: {}
  },
  _elementSize = '',
  _disabled,
  _mandatory,
  _options,
}) {
  const isError = Boolean(_errorMsg);
  const isMultiline = _options?.multiline === true;
  return (
    <>
      <Typography variant="subtitle2" sx={_style._typography}>
        {_name} {_mandatory && <span style={{ color: 'red' }}>*</span>}&nbsp;
      </Typography>
      <TextField
        size={_elementSize}
        fullWidth
        // type={_type}
        type={isMultiline ? undefined : _type}
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
          }
        }}
        sx={{
          '& .MuiInputBase-input': {
            padding: '12px 14px',     // 👈 input padding
            height: '20px',           // 👈 input height
          },
        }}
      />
    </>
  );
}

export default InputText;
