const dummyInputs = [
  {
    _key: "instrument_title",
    _name: "Instrument Title",
    _value: "",
    _type: "text",
    _placeholder: "Instrument Name",
    _helperText: "Please enter instrument name",
    _mandatory: true,
    _disabled: false,
    _errorMsg: "",
  },
  {
    _key: "instrument_price",
    _name: "Instrument Price",
    _value: "",
    _type: "number",
    _placeholder: "Instrument Price",
    _helperText: "Please enter instrument price",
    _mandatory: true,
    _disabled: false,
    _errorMsg: "",
  },
  {
    _key: "instrurment_description",
    _name: "Instrument Description",
    _value: "",
    _type: "text",
    _placeholder: "Instrument Description",
    _helperText: "Please enter instrument description",
    _mandatory: true,
    _disabled: false,
    _errorMsg: "",
    _options: {
        multiline: true,
        rows: 2
    },
  },
  {
    _key: "instrument_images",
    _name: "Instrument Images",
    _value: [],
    _type: "file",
    _placeholder: "Upload Instrument Images",
    _helperText: "You can upload multiple images",
    _mandatory: true,
    _multiple: true,
    _accept: "image/*",
    _errorMsg: "",
    _gridSize: 6,
  },
];

export default dummyInputs;
