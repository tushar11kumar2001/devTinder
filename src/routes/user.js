const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequestSchema");
const UserModel = require("../models/userSchema");

const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  //view only those request whose is interested
  try {
    const loggedInUser = req.user;
    const totalConnectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "about"]); //if you are not giving fields array which you want then it will give you all fields of each document
    if (totalConnectionRequests.length == 0) {
      throw new Error("You have not any connection request..");
    }
    //   console.log("total connection request : ", totalConnectionRequests);
    res.json({
      message: "Total request ",
      data: totalConnectionRequests,
    });
  } catch (err) {
    res.json({
      message: `${err.message}`,
    });
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    const data = connections.map((e) => {
      if (e.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return e.toUserId;
      } else {
        return e.fromUserId;
      }
    });
    res.json({
      data: data,
    });
  } catch (err) {
    res.json({
      message: `${err.message}`,
      status: "400",
    });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  //show all user in user collection expect :
  // 1. which is present in connection request because if once any request has been sent then that user will not shown in feed
  // 2. LoggedInUser itself
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page*limit)-limit;
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hideUserFromFeed = new Set();
    connectionRequest.forEach((e) => {
      hideUserFromFeed.add(e.fromUserId.toString());
      hideUserFromFeed.add(e.toUserId.toString());
    });


    const feedData = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
    .select("firstName lastName age about gender")
    .skip(skip)
    .limit(limit);
    res.json({ data: feedData });
  } catch (err) {
    res.json({
      message: `${err.message}`,
      status: "400",
    });
  }
});
module.exports = userRouter;
