const jwt = require("jsonwebtoken");
const UserModel = require("../models/userSchema")
const userAuth = async(req,res,next)=>{
    try{
    const { token } = req.cookies;
    if(!token){
    throw new Error("Invalid Token");
    }
    const decodeObj = await jwt.verify(token,"tusharkumar@123");
    const { _id } = decodeObj;
    const user = await UserModel.findById(_id);
    
    if(!user){
    throw new Error("User not found");
    }
    req.user = user;
    next();
    }catch(err){
        res.send("ERROR : "+err.message);
    }
}

module.exports = {
    userAuth
}