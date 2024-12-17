const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateUpdateProfileData } = require("../utils/validation");


const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (err) {
      res.send("ERROR : " + err.message);
    }
  });

  profileRouter.patch("/profile/edit", userAuth, async (req,res)=>{
     try{
       if(!validateUpdateProfileData(req)){
        throw new Error("You are trying to update restricted fields..");
       }
       const loggedInUser = req.user;
       Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
       await loggedInUser.save();
        res.json({
          "message":`${loggedInUser.firstName}, Your profile has  Updated successfully..`,
          "data":loggedInUser
        })
     }catch(err){
        res.json({
            "message":`${err.message}`,
            "status":"400"
        })
    }
 
  });


  module.exports = profileRouter;