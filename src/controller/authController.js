const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");
const {validateSignupData} = require("../utils/validation.js");

const signup = async (req, res) => {
  try {
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res
      .status(201)
      .json({ success: true, message: "User added successfully", user });
  } catch (error) {
    return res.status(400).send("Error saving user:  " + error.message);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const ispasswordValid = await user.validatePassword(password);
    if (!ispasswordValid) {
      return res.status(200).json("Invalid Credentails");
    }
    const token = await user.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    return res.status(200).json({
      message: "User Logged in Successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const logout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { signup, login, logout };
