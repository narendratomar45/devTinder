const express = require("express");
const userAuth = require("../Middleware/authMiddleware");
const {
  sendRequest,
  accepteRequest,
} = require("../controller/requestController");

const router = express.Router();
router.post("/request/send/:status/:toUserId", userAuth, sendRequest);
router.post("/request/review/:status/:requestId", userAuth, accepteRequest);
module.exports = router;
