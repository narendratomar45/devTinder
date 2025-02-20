const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, maxLength: 50 },
    lastName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address ", +value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password");
        }
      },
    },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
    },
    photoUrl: {
      type: String,
      default: "https://statinfer.com/wp-content/uploads/dummy-user.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL");
        }
      },
    },
    about: { type: String },
    skills: { type: [String] },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "4583@Narendra", {
    expiresIn: "7d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const hashedPassword = user.password;
  const ispasswordValid = await bcrypt.compare(
    userInputPassword,
    hashedPassword
  );
  return ispasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
