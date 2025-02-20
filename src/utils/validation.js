const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName) {
    throw new Error("Enter your firstName");
  }
  if (!lastName) {
    throw new Error("Enter your  lastName");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email Id");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};
const validationPasswordChange = (req) => {
  const { password } = req.body;
};

module.exports = { validateSignupData, validateProfileData };
