const User = require("../models/userModel");
const  validateProfileData  = require("../utils/validation");

const profile = async (req, res) => {
  try {
    const user = req.user;
    return res
      .status(200)
      .json({ success: true, message: "User Profile", user });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const editProfile = async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      return res.status(400).json({ message: "Invalid Edit Request" });
    }
    const loggedInUser =  req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    return res.status(200).json({
      success: true,
      message: `${loggedInUser.firstName}User Details Edit Successfully`,
      loggedInUser,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
module.exports = { profile, editProfile };
