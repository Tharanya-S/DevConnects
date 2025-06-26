const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body; //deconstructing the req.body
  //validating firstname and lastname
  if (firstName.length === 0 || lastName.length === 0) {
    throw new Error("Invalid name");
  }

  //validating emailId
 if (!validator.isEmail(emailId)) {
    throw new Error("Invalid emailId");
  }
  //validating password
  else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password!");
  }
};

const validateEdit = (req) => {
  //list the fields that are acceptable to edit
  const editableFields = [
    "firstName",
    "lastName",
    "age",
    "skills",
    "photoUrl",
    "gender",
  ];

  //Now check if the fields from the request body is present in the allowed fields list
  // const isEditAllowed =
  //   Object.keys(req.body).every((field) => editableFields.includes(field))

  const isEditAllowed =
    Object.keys(req.body).every((field) => editableFields.includes(field)) &&
    (!req.body.skills || req.body?.skills?.length < 20);

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEdit };
