const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId,ref:"User", required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId,ref:"User", required: true },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  { timestamps: true }
);

requestSchema.index({ fromUserId: 1, toUserId: 1 });

requestSchema.pre("save", function (next) {
  const request = this;
  if (request.fromUserId.equals(request.toUserId)) {
    throw new Error("Can't send connection request to yourself");
  }
  next();
});

const Request = new mongoose.model("Request", requestSchema);
module.exports = Request;
