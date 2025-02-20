const Request = require("../models/requestModel");
const User = require("../models/userModel");

const sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid Status Type" + status });
    }
    const existingConnectionRequest = await Request.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already sent" });
    }
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: "Invalid User" });
    }

    const connectionRequest = new Request({ fromUserId, toUserId, status });
    const connectionRequestData = await connectionRequest.save();
    return res.status(200).json({
      success: true,
      message: `${fromUserId.firstName} ${status} in you`,
      connectionRequestData,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const accepteRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    console.log("PA", req.params);

    // if (!loggedInUser) {
    //   return res.status(404).json({ message: "User not found" });
    // }
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(404)
        .json({ message: "Invalid Status Type:" + " " + status });
    }
    const connectionRequest = await Request.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();

    return res
      .status(200)
      .json({ success: true, message: `Request ${status} `, data });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
module.exports = { sendRequest, accepteRequest };
