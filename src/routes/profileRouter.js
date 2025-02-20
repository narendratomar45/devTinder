const express = require("express");
const { profile, editProfile } = require("../controller/profileController.js");
const userAuth = require("../Middleware/authMiddleware");
const router = express.Router();
router.get("/profile/view", userAuth, profile);
router.patch("/profile/edit", userAuth, editProfile);
module.exports = router;
