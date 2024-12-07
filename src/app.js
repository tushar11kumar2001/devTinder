const connectDB = require("./config/database");
const express = require("express");
const UserModel = require("./models/user");
const app = express();

app.use(express.json())

app.post("/signup",async(req,res)=>{
    //creating a new instance of the UserModel
    const user = new UserModel(req.body)
    try{   
        await user.save();
        res.send("User added successfully..")
    }catch(err){
        throw new Error(err.message);
    }
  
});
//find the user by emailId...
app.get("/user",async(req,res)=>{
    const userEmail = req.body.emailId;
    try{
       const users = await UserModel.find({emailId:userEmail});
       if(users.length === 0){
        res.status(404).send("User not found");
       }else{
       res.send(users);
       }
    }catch(err){
      res.send("Something went wrong");
    }
});
//find all users for feed
app.get("/feed",async(req,res)=>{
    try{
    const users = await UserModel.find({}).exec();
    if(users.length === 0){
        res.status(404).send("User not found");
       }else{
       res.send(users);
       }
    }catch(err){
        res.send("Something went wrong");
      }
})
app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(400).send("something went wrong..");
    }
})
connectDB()
    .then(()=>{
        console.log("Database connection established...");
        app.listen(1100, () => {
            console.log("Server is successfully listening on port 1100");
          });
        
    })
    .catch((err)=>{
        console.log("Database cannot be connected...");
    })

