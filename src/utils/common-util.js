import { jwtDecode } from "jwt-decode";

export const getDecodedToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (err) {
    return null;
  }
};


export const validateInputs = (inputs) => {
  let hasError = false;
  inputs = inputs.map((p) => {
    if (
      p._mandatory &&
      (p._value === "" || (Array.isArray(p._value) && p._value.length === 0))
    ) {
      p._errorMsg = `${p._name} is mandatory`;
      hasError = true;
    } 
    else if (p._key === "em" && p._value) {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(p._value)) {
        p._errorMsg = "Invalid email format";
        hasError = true;
      }
    } 
    else if (p._key === "pwd" && p._value) {
      // const passwordRegex =
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      // if (!passwordRegex.test(p._value)) {
      //   p._errorMsg =
      //     "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";
      //   hasError = true;
      // }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
      if (!passwordRegex.test(p._value)) {
        p._errorMsg =
          "Password must include uppercase, lowercase, number, and special character";
        hasError = true;
      }
    } 
    else if (p._key === "phone_number" && p._value) {
      const onlyDigitsRegex = /^[0-9]+$/;
      if (!onlyDigitsRegex.test(p._value)) {
        p._errorMsg = "Phone number must contain only numbers";
        hasError = true;
      } else if (p._value.length !== 10) {
        p._errorMsg = "Mobile number must be exactly 10 digits";
        hasError = true;
      }
    } else {
      p._errorMsg = "";
    }
    return p;
  });
  return {
    hasError,
    inputs,
  };
};

export const extractJsonObject = (inputs) => {
  let tempObj = {};
  for (let obj of inputs) {
    tempObj[obj._key] = obj._value;
  }
  return tempObj;
};

export const resetInputs = (inputs) => {
  return inputs.map((p) => {
    if (Array.isArray(p._value)) {
      return { ...p, _value: [] };
    } else if (p._value !== null && typeof p._value === "object") {
      return { ...p, _value: {} };
    } else {
      return { ...p, _value: "" };
    }
  });
};


export const filterData = (data, headCells) => {
  let response = { header: [], rows: [] };

  if (data.length > 0) {
    const header = headCells.map(h => h._label);
    const keys = headCells.map(h => h._col);

    const rows = data.map(rowObj =>
      keys.map(key => {
        if (key === "instrument") {
          return rowObj.instrument?.instrument_title || "";
        }
        if (key === "temp_action") return rowObj; 
        return rowObj[key] ?? "";
      })
    );

    response = { header, rows };
  }

  return response;
};

export const truncate = (text, limit) => {
  if (!text) return "";

  return text.length > limit
    ? text.substring(0, limit) + "..."
    : text;  // if small, return as it is
};

export const getFullName = (firstname = "", lastname = "") => {
  return [firstname?.trim(), lastname?.trim()]
    .filter(Boolean)
    .join(" ");
};



