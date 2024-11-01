const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId } = req.body; //deconstructing the req.body
  //validating firstname and lastname
  if (firstName.length === 0 || lastName.length === 0) {
    throw new Error("Invalid name");
  }

  //validating emailId
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid emailId");
  }
};

module.exports = { validateSignUpData };
