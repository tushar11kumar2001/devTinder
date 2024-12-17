const express = require("express");
const jwt = require("jsonwebtoken");
const sendOtpToUserEmail = require("../utils/otpConfig");
const UserModel = require("../models/userSchema");
const otpRouter = express.Router();

otpRouter.patch("/generateotp", async (req, res)=>{
    try{
      const {emailId} = req.body;
      const user = await UserModel.findOne({emailId: emailId});
      
      if(!user){
        throw new Error("User not found");
      }
      const randomKey = Math.floor(Math.random()*10000);
      const otpToken = await jwt.sign({otp : randomKey},"tusharkumar@123",{
           expiresIn: "4m"
      });
      console.log("otpToken : ",otpToken);
      
      await sendOtpToUserEmail(user?.emailId,randomKey);


      
      res.cookie("otpToken",otpToken,{
        expires: new Date(Date.now() + 4*60000)
      }).json({
        "messaage":"Send otp to your registered email",
      });
    }catch(err){
      res.send("ERROR : " + err.message)
    }

  })

  module.exports = otpRouter;