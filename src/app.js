const express = require('express');

const app = express();

app.get("/user",(req,res)=>{
   res.send("successfully...")
})

app.listen(1100,()=>{
    console.log("Server is successfully listening on port 1100");
    
});