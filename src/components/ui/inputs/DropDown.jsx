// import {
//   Checkbox,
//   FormControl,
//   FormHelperText,
//   MenuItem,
//   Select,
//   Typography,
// } from "@mui/material";
// import React from "react";

// function DropDown({
//   _name,
//   _value,
//   _placeholder,
//   _helperText,
//   _errorMsg,
//   onChange,
//   _options = [],
//   _style = { _typography: {} },
//   _elementSize = "small",
//   _multiple = false,
//   _mandatory = false,
// }) {
//   const isError = Boolean(_errorMsg);

//   return (
//     <>
//       <Typography variant="subtitle2" sx={_style._typography}>
//         {_name} {_mandatory && <span style={{ color: "red" }}>*</span>}
//       </Typography>

//       <FormControl fullWidth size={_elementSize} error={isError}>
//         <Select
//           displayEmpty
//           value={_value}
//           onChange={onChange}
//           multiple={_multiple}
//           renderValue={(selected) => {
//             if (!selected || selected.length === 0) {
//               return <span style={{ color: "#aaa" }}>{_placeholder}</span>;
//             }
//             return selected.toString();
//           }}
//           sx={{
//             "& .MuiSelect-select": {
//               padding: "12px 14px",
//               height: "20px",
//               display: "flex",
//               alignItems: "center",
//             },
//           }}
//         >
//           {/* Placeholder */}

//           {_options.map((opt, i) => (
//             <MenuItem
//               sx={{
//                 borderRadius: "2px",
//                 transition: "0.3s",
//                 px: 2,
//                 py: 1,
//                 "&:hover": {
//                   backgroundColor: "#1976d2", // hover background
//                   color: "#fff", // hover text color
//                 },
//                 "&.Mui-selected": {
//                   backgroundColor: "#125aa0", // active/selected background
//                   color: "#fff", // active/selected text
//                   "&:hover": {
//                     backgroundColor: "#0f457d", // hover while selected
//                   },
//                 },
//               }}
//               key={i}
//               value={opt}
//             >
//               {opt}
//             </MenuItem>
//           ))}
//         </Select>

//         <FormHelperText sx={{ marginLeft: 0 }}>
//           {isError ? _errorMsg : _helperText}
//         </FormHelperText>
//       </FormControl>
//     </>
//   );
// }

// export default DropDown;

import {
  Checkbox,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React from "react";

function DropDown({
  _name,
  _value,
  _placeholder,
  _helperText,
  _errorMsg,
  onChange,
  _options = [],
  _style = { _typography: {} },
  _elementSize = "small",
  _multiple = false,
  _mandatory = false,
}) {
  const isError = Boolean(_errorMsg);

  return (
    <>
      <Typography variant="subtitle2" sx={_style._typography}>
        {_name} {_mandatory && <span style={{ color: "red" }}>*</span>}
      </Typography>

      <FormControl fullWidth size={_elementSize} error={isError}>
        <Select
          displayEmpty
          value={_value}
          onChange={onChange}
          multiple={_multiple}
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: "#aaa" }}>{_placeholder}</span>;
            }

            const selectedObj = _options.find((o) => o.value === selected);
            return selectedObj ? selectedObj.label : selected;
          }}
          sx={{
            "& .MuiSelect-select": {
              padding: "12px 14px",
              height: "20px",
              display: "flex",
              alignItems: "center",
            },
          }}
        >
          {_options.map((opt, i) => (
            <MenuItem
              key={i}
              value={opt.value} // IMPORTANT: this is ID
              sx={{
                borderRadius: "2px",
                transition: "0.3s",
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                },
                "&.Mui-selected": {
                  backgroundColor: "#125aa0",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#0f457d",
                  },
                },
              }}
            >
              {opt.label}
            </MenuItem>
          ))}
        </Select>

        <FormHelperText sx={{ marginLeft: 0 }}>
          {isError ? _errorMsg : _helperText}
        </FormHelperText>
      </FormControl>
    </>
  );
}

export default DropDown;

