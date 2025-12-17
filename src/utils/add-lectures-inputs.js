// {
//             _key: "product_category",
//             _name: "Product Category",
//             _value: [],
//             _type: "dropdown",
//             _options: [],
//             _placeholder: "",
//             _size: "small",
//             _multiple: true,
//             _helperText: "Please select product category",
//             _mandatory: true,
//             _disabled: false,
//             _errorMsg: "",
//             _gridSize: 6
// },


// dc
// {
//         _key: "product_category",
//         _name: "Product Category",
//         _value: "",
//         _type: "dropdown",
//         _options: [],
//         _placeholder: "",
//         _size: "small",
//         _multiple: false,
//         _helperText: "Please select product category",
//         _mandatory: true,
//         _disabled: false,
//         _errorMsg: "",
//         _gridSize: 6
//     },

const addLecturesInputs = [
  {
    _key: "lecture_title",
    _name: "Lecture Title",
    _value: "",
    _type: "text",
    _placeholder: "Lecture Name",
    _helperText: "Please enter lecture name",
    _mandatory: true,
    _disabled: false,
    _errorMsg: "",
  },
  {
    _key: "lecture_video",
    _name: "Lecture Videos",
    _value: [],
    _type: "file",
    _placeholder: "Upload Lecture Videos",
    _helperText: "You can upload video",
    _mandatory: true,
    _multiple: true,
    _accept: "video/*",
    _errorMsg: "",
    _gridSize: 6,
  }
];

export default addLecturesInputs;

