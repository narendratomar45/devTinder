const Request = require("../models/requestModel");
const User = require("../models/userModel");
const USER_SAVE_DATA = " firstName lastName age gender skills  about";
const getPendingRequests = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendinRequests = await Request.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "about",
    ]);
    return res.status(200).json({
      success: true,
      message: "Pending Requests Fetches Successfully",
      pendinRequests,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const getAllConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await Request.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAVE_DATA)
      .populate("toUserId", USER_SAVE_DATA);

    const data = connectionRequest.map((connection) => {
      if (connection.fromUserId.toString() === loggedInUser._id.toString()) {
        connection.toUserId;
      }
      return connection.fromUserId;
    });

    return res.status(200).json({
      message: "Connection request found successfully",
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
const userFeed = async (req, res) => {
  try {
    //user should show all the user except - himself, his conncetions, ignored people, already sent connectiob request
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;

    //all connection requesta(sent+recieved)
    const conncetionRequest = await Request.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    conncetionRequest.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId).toString();
      hideUsersFromFeed.add(request.toUserId).toString();
    });
    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAVE_DATA)
      .skip(skip)
      .limit(limit);
    return res.status(200).json({ feedUsers });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
module.exports = { getPendingRequests, getAllConnections, userFeed };
