const express = require("express");
const jwt = require("jsonwebtoken");
const sendOtpToUserEmail = require("../utils/otpConfig");
const UserModel = require("../models/userSchema");
const otpRouter = express.Router();

otpRouter.post("/generateotp", async (req, res)=>{
    try{
      const {emailId} = req.body;
      const user = await UserModel.findOne({emailId: emailId});
      
      if(!user){
        throw new Error("User not found");
      }
      const randomKey = Math.floor(Math.random()*10000).toString();
      const otpToken = await jwt.sign({otp : randomKey},"tusharkumar@123",{
           expiresIn: "4m"
      });
    //   console.log("otpToken : ",otpToken);
      
      await sendOtpToUserEmail(user?.emailId,randomKey);



      res.cookie("otpToken",otpToken,{
        expires: new Date(Date.now() + 4*60000)
      }).json({
        "messaage":"Send otp to your registered email",
      });
    }catch(err){
      res.send("ERROR : " + err.message)
    }
});

otpRouter.post("/checkotp",async (req,res)=>{
  try{
    const {userOtp} = req.body;
    const {otpToken} = req.cookies;
    if(!otpToken){
      throw new Error("Generate your otp to change your password")
    }

    const {otp} = await jwt.verify(otpToken,"tusharkumar@123");
    if(userOtp == otp){
        res.json({
          "message":"OTP IS CORRECT NOW YOU CAN CHANGE PASSWORD"
        })
    }else{
        throw new Error("Enter a valid otp for next step..")
    }

  }catch (err) {
    res.json({
      status: "400",
      message: `${err.message}`,
    });
  }
})

module.exports = otpRouter;