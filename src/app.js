const connectDB = require("./config/database");
const express = require("express");

const app = express();

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

