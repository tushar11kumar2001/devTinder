const express = require('express');

const app = express();

app.use("/",(req,res)=>{
    console.log("home request");

    res.send("Welcome to Dashboard..");
})
app.use("/hello",(req,res)=>{
    console.log("hello request");
    
    res.send("Hello hello hello...");
})

app.listen(1100,()=>{
    console.log("Server is successfully listening on port 1100");
    
});