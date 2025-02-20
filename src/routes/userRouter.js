const express = require("express");
const userAuth = require("../Middleware/authMiddleware");
const {
  getPendingRequests,
  getAllConnections,
  userFeed,
} = require("../controller/userController");
const router = express.Router();
router.get("/user/request/recieved", userAuth, getPendingRequests);
router.get("/user/connections", userAuth, getAllConnections);
router.get("/feed", userAuth, userFeed);
module.exports = router;
