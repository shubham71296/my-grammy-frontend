const userForgotPwdInputs = [
  {
    _key: "em",
    _name: "Email",
    _value: "",
    _type: "text",
    _placeholder: "Email Id",
    _size: "small",
    _helperText: "Please enter Email Id",
    _mandatory: true,
    _disabled: false,
    _errorMsg: "",
    _gridSize: 12,
  },
  {
    _key: 'reset_pwd_otp',
    _name: 'OTP',
    _value: '',
    _type: 'number',
    _placeholder: 'Enter OTP',
    _size: 'small',
    _helperText: 'Please enter the OTP sent to your email',
    _mandatory: true,
    _disabled: false,
    _errorMsg: '',
    _gridSize: 12
  },
  {
    _key: "pwd",
    _name: "Password",
    _value: "",
    _type: "password",
    _placeholder: "••••••••",
    _size: "small",
    _helperText: "Please enter password",
    _mandatory: true,
    _disabled: false,
    _errorMsg: "",
    _gridSize: 12,
   // _options: { inputProps: { maxLength: 10 } },
  },
  {
    _key: 'cpwd',
    _name: 'Confirm Password',
    _value: '',
    _type: 'password',
    _placeholder: 'Confirm Password',
    _size: 'small',
    _helperText: 'Re-enter your new password',
    _mandatory: true,
    _disabled: false,
    _errorMsg: '',
    _gridSize: 12
  }
];

export default userForgotPwdInputs;
