const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequestSchema");
const UserModel = require("../models/userSchema");
const connectionRequestRouter = express.Router();

connectionRequestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res)=>{
    try{
         const fromUserId = req.user._id;
         const toUserId = req.params.toUserId;
         const status = req.params.status;
         
         const allowedStatus = ["interested","ignored"];

         if(!allowedStatus.includes(status)){
            return res.json({
                "message":"Invalid request status "
            })
         }
         const toUser = await UserModel.findById(toUserId);
         if(!toUser){
            return res.json({
                "message":"User not found"
            })
         }
         const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or : [
                {fromUserId, toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
         });
         
         if(existingConnectionRequest){
            return res.json({
                "message":"Connection request has already sent"
            })
         }
         const newConnectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
         })
         await newConnectionRequest.save();
         res.send(newConnectionRequest);
    }catch (err) {
        res.json({
          message: `${err.message}`,
          status: "400",
        })
    }
});




module.exports = connectionRequestRouter;