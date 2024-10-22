const express = require("express");
const UserSchema = require("./models/user");
const { connectDB } = require("./config/database");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  //creating a new instance for the user model
  // console.log(req.body);
  const user = new UserSchema(req.body);
  try {
    // throw new Error();
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    console.log("User could not be updated");
    res.status(401).send("User failed to update");
  }
});

app.get("/getUser", async (req, res) => {
  const userEmailId = req.body.emailId;
  try {
    const user = await UserSchema.find({ emailId: userEmailId });
    res.send(user);
  } catch (err) {
    res.status(401).send("Error Occurred");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await UserSchema.find({});
    res.send(users);
  } catch (err) {
    res.status(401).send("Error occured !!! ");
  }
});

app.get("/getUserById", async (req, res) => {
  const id = req.body._id;
  try {
    const user = await UserSchema.findById(id).exec();
    // console.log(user);
    if (user.length === 0) {
      res.send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(401).send("Error Occurred");
  }
});

//API to delete user
app.delete("/user", async (req, res) => {
  const userName = req.body; //deleting the user based on name
  console.log("userName", userName);
  try {
    const user = await UserSchema.deleteOne(userName);
    console.log(user.deletedCount);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(401).send("Error Occurred");
    console.log(err);
  }
});

//API - find and update by Id
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await UserSchema.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
    });
    res.send("User Updated successfully");
    console.log(user);
  } catch (err) {
    res.status(401).send("Error Occurred");
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
