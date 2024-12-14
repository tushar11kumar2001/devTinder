const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userSchema");
const { validateSignUpData } = require("../utils/validation");

const authRouter = express.Router();
authRouter.post("/signup", async (req, res) => {
  try {
    //validate of data of signup api
    validateSignUpData(req);

    //password encryption
    const { firstName, lastName, emailId, password } = req.body;
    const encryPassword = await bcrypt.hash(password, 10);

    //creating a new instance of the UserModel
    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      password: encryPassword,
    });

    await user.save();
    res.send("User added successfully..");
  } catch (err) {
    res.status(404).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const user = await UserModel.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("Ivalid credentials");
      }
      const isValidPassword = await user.validatePassword(password);
  
      if (isValidPassword) {
        const token = await user.getJWT();
        res.cookie("token", token,{
            expires: new Date(Date.now() + 8 * 3600000)
        }).send("login successfully....");
      } else {
        throw new Error("Ivalid credentials");
      }
    } catch (err) {
      res.send("ERROR : " + err.message);
    }
  });

  authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    }).send("Logout successfully...");
  })
  module.exports = authRouter;