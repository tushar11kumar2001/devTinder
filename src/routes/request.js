const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequestSchema");
const UserModel = require("../models/userSchema");
const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    //check status : ignored or interested
    //toUserId is present in user collection
    //if one user send request then that user cannot send connection request again and second user cannot send connection request
    //user should not send request himself..
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.json({
          message: "Invalid request status ",
        });
      }
      const toUser = await UserModel.findById(toUserId);
      if (!toUser) {
        return res.json({
          message: "User not found",
        });
      }
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.json({
          message: "Connection request has already sent",
        });
      }
      const newConnectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      await newConnectionRequest.save();
      res.send(newConnectionRequest);
    } catch (err) {
      res.json({
        message: `${err.message}`,
        status: "400",
      });
    }
  }
);
connectionRequestRouter.post(
  "/request/action/:status/:fromUserId",
  userAuth,
  async (req, res) => {
    //check status : accepted or rejected
    //check loggedInUserId with fromUserId
    //find request with sender id in connection collection
    try {
      const { status } = req.params;
      const { fromUserId } = req.params;
      const ALLOWED_STATUS = ["accepted", "rejected"];

      if (!ALLOWED_STATUS.includes(status)) {
        throw new Error("Invalid request status");
      }
      if (fromUserId.toString() === req.user._id.toString()) {
        throw new Error("Invalid request Id");
      }
      let request;
      if (status === "rejected") {
        request = await ConnectionRequestModel.findOneAndDelete({
          fromUserId: fromUserId,
          toUserId: req.user._id,
          status: "interested",
        });
        if(!request){
          throw new Error("Rejected : There is no request pending with this user");
        }
      } else {
         request = await ConnectionRequestModel.findOne({
          fromUserId: fromUserId,
          toUserId: req.user._id,
          status: "interested",
        });
        if (!request) {
          throw new Error("There is no request pending with this user"); 
        }
        request.status = status;
        await request.save();
      }
     
      res.json({
        message: `Request ${status} successfully`,
        data: request,
      });
    } catch (err) {
      res.json({
        message: `${err.message}`,
        status: "400",
      });
    }
  }
);

module.exports = connectionRequestRouter;
