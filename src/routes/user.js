const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequestSchema");

const userRouter = express.Router();

userRouter.get("/user/requests", userAuth, async (req, res) => {
    //view only those request whose is interested
    try {
      const loggedInUser = req.user;
      const totalConnectionRequests = await ConnectionRequestModel.find({
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate("fromUserId",["firstName" , "lastName","about"]); //if you are not giving fields array which you want then it will give you all fields of each document
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

module.exports = userRouter;