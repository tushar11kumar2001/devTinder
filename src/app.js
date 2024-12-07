const express = require("express");

const app = express();

// this is the authorization middleware..
app.use("/admin",(req,res,next)=>{
    const token = "xyz";
    if(token === "xyz") next();
    else res.send("You have not authorization..")
    
})
app.get("/admin/getAllData",(req,res)=>{
    res.send("Get all data...");
})
app.get("/admin/deleteUser",(req,res)=>{
    res.send("Deleted user");
})


app.listen(1100, () => {
  console.log("Server is successfully listening on port 1100");
});
