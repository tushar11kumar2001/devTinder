const express = require("express");
const {adminAuth} =  require("./middleware/auth")
const app = express();

// this is the authorization middleware..
app.use("/admin",adminAuth)
app.get("/admin/getAllData",(req,res)=>{
    res.send("Get all data...");
})
app.get("/admin/deleteUser",(req,res)=>{
    res.send("Deleted user");
})


app.listen(1100, () => {
  console.log("Server is successfully listening on port 1100");
});
