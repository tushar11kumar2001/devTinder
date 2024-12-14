const connectDB = require("./config/database");
const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/",authRouter);
app.use("/",profileRouter);
// app.use("/",Router);



connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(1100, () => {
      console.log("Server is successfully listening on port 1100");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected...");
  });
