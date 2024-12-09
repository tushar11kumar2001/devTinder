const connectDB = require("./config/database");
const express = require("express");
const UserModel = require("./models/user");
const app = express();

app.use(express.json())

app.post("/signup",async(req,res)=>{
    //creating a new instance of the UserModel
    const user = new UserModel(req.body);
    try{
        await user.save();
        res.send("User added successfully..");
    }catch(err){
        res.status(404).send(err.message);
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
//delete user from the database
app.delete("/user",async (req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const result = await UserModel.findOneAndDelete({emailId:userEmail});
        res.send(result);
    }catch(err){
        res.send("Something went wrong");
      }
})
//Update user
app.patch("/user",async(req,res)=>{
    const userEmail = req.body.emailId;
    const ALLOWED_UPDATES = [
        "emailId",
        "password",
        "photoUrl",
        "about",
        "skills",
        "gender"
    ];
    const isUpdateAllowed = Object.keys(req.body).every((k)=> ALLOWED_UPDATES.includes(k));
    try{
        if( !isUpdateAllowed ) throw new Error("You are trying to update restricted fields...")
        await UserModel.findOneAndUpdate({emailId:userEmail},req.body,{
            returnDocument:'after',
            runValidators:true

        });     
        res.send("User update successfully");
    }catch(err){
        res.status(400).send("Update Failed : "+err.message);
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

