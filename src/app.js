const express = require('express');

const app = express();

app.use("/hello/friend",(req,res)=>{
    res.send("can we friend?");
})
app.use("/hello",(req,res)=>{    
    res.send("Hello hello hello...");
})
app.use("/",(req,res)=>{
    res.send("Welcome to Dashboard..")
})

app.listen(1100,()=>{
    console.log("Server is successfully listening on port 1100");
    
});