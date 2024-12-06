const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res, next) => {
    console.log("1st route handle...");
    next();
  }
);
app.use(
    "/user",
    (req, res, next) => {
      console.log("2nd route handle...");
      res.send("2nd route handle...")
    }
  );
app.listen(1100, () => {
  console.log("Server is successfully listening on port 1100");
});
