const express = require("express");
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid Status, " + status });
    };

    const doesUserExist = await User.findById(toUserId);

    if (!doesUserExist) {
      return res.status(400).json({ message: "User not found!!!" });
    }

    const doesConnectionRequestExist = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (doesConnectionRequestExist) {
      return res.status(400).json({ message: "Connect Requestion already Exist!!!" });
    };

    const connectionRequest = new ConnectionRequest({
      fromUserId, toUserId, status
    });

    const data = await connectionRequest.save();
    const messageForBothStatus = status ===  "interested"  ? "Connetion Request has sent successfully" : "You Ignored " + doesUserExist.firstName
    res.json({
      message: messageForBothStatus,
      data,
    });
  } catch (error) {
    res.send("ERROR : " + error.message);
  }
});

module.exports = requestRouter;