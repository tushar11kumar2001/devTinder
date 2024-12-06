const express = require('express');

const app = express();

app.get("/user",(req,res)=>{
    res.send({
        first_name:"Tushar",
        last_name:"Kumar"
    })
})
app.post("/user",(req,res)=>{
    console.log("USER data add...");
    res.send("user added successfully..")
})
app.delete("/user",(req,res)=>{
    res.send("user delete successfully...")
})

//this will match all http api method requests
app.use("/",(req,res)=>{
    res.send("Welcome to Dashboard..")
})

app.listen(1100,()=>{
    console.log("Server is successfully listening on port 1100");
    
});