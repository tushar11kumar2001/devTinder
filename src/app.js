const connectDB = require("./config/database");
const express = require("express");
const UserModel = require("./models/userSchema");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");
const { validateSignUpData } = require("./utils/validation");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
  try {
    //validate of data of signup api
    validateSignUpData(req);

    //password encryption
    const { firstName, lastName, emailId, password } = req.body;
    const encryPassword = await bcrypt.hash(password, 10);

    //creating a new instance of the UserModel
    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      password: encryPassword,
    });

    await user.save();
    res.send("User added successfully..");
  } catch (err) {
    res.status(404).send(err.message);
  }
});

//User login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await UserModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Ivalid credentials");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const token = await jwt.sign({ _id: user._id }, "tusharkumar@123");
      res.cookie("token", token).send("login successfully....");
    } else {
      throw new Error("Ivalid credentials");
    }
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

//Profile api
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.send("ERROR : " + err.message);
  }
});

//find the user by emailId...
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await UserModel.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.send("Something went wrong");
  }
});

//find all users for feed
app.get("/feed", async (req, res) => {
  try {
    const users = await UserModel.find({}).exec();
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.send("Something went wrong");
  }
});

//delete user from the database
app.delete("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const result = await UserModel.findOneAndDelete({ emailId: userEmail });
    res.send(result);
  } catch (err) {
    res.send("Something went wrong");
  }
});

//Update user
app.patch("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  const ALLOWED_UPDATES = [
    "emailId",
    "password",
    "photoUrl",
    "about",
    "skills",
    "gender",
  ];
  const isUpdateAllowed = Object.keys(req.body).every((k) =>
    ALLOWED_UPDATES.includes(k)
  );
  try {
    if (!isUpdateAllowed)
      throw new Error("You are trying to update restricted fields...");
    await UserModel.findOneAndUpdate({ emailId: userEmail }, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User update successfully");
  } catch (err) {
    res.status(400).send("Update Failed : " + err.message);
  }
});

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
