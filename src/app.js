const express = require("express");
const UserSchema = require("./models/user");
const { connectDB } = require("./config/database");

const app = express();

app.post("/login", async (req, res) => {
  //creating a new instance for the user model
  const user = new UserSchema({
    firstName: "Harry",
    lastName: "Potter",
    emailId: "Harry.potter@gmail.com",
    password: "Harry@1234",
    age: 25,
    gender: "Male",
  });
  try {
    // throw new Error();
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    console.log("User could not be updated");
    res.status(401).send("User failed to update");
  }
});

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(7777, () => {
      console.log("Server running successfully on Port : 7777");
    });
  })
  .catch(() => {
    console.log("DB not connected");
  });
