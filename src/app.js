const express = require('express');

const app = express();

//when you put ? after any letter it mean that letter is optional 
//when you put + after any letter it mean that letter comes many times
//when you put * it means anything can comes in between that pattern 
app.get("/user",(req,res)=>{
    console.log(req.query);
    
    res.send("successfull....")
})

app.listen(1100,()=>{
    console.log("Server is successfully listening on port 1100");
    
});