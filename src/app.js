const express = require("express");
const UserSchema = require("./models/user");
const { connectDB } = require("./config/database");
const { validateSignUpData } = require("./utils/validations");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //1.validate the data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body; //Now this allows only this 4 fields to enter the database

    //2.encrypting the password
    const passwordHash = await bcrypt.hash(password, 10);

    //creating a new instance for the user model
    //const user = new UserSchema(req.body);//this was not a proper way of getting the data from req body
    const user = new UserSchema({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    }); //unwanted data from the req.body will be ignored

    await user.save();
    res.send("User added successfully");
    console.log(lastName, lastName.length);
  } catch (err) {
    console.log("User could not be updated");
    res.status(401).send("User failed to update " + err.message);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    //validate if the emailId is emailId
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email Id");
    }
    //check if the user with the given emailId is present in the Db
    const currentUser = await UserSchema.findOne({ emailId }).exec();

    if (!currentUser) {
      throw new Error("Invalid crendentials");
    }

    //check if the currentUser.password is same as the password given by the user now
    const passwordCheck = await bcrypt.compare(password, currentUser.password);

    if (passwordCheck) {
      //create the JWT token
      const token = jwt.sign({ _id: currentUser._id }, "DevConnects$1206", {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });

      res.send("Login successfull");
    } else {
      throw new Error("Invaild crendentials");
    }
  } catch (err) {
    res.status(401).send("Error : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.send(loggedInUser);
  } catch (err) {
    res.status(400).send("Login unsuccessfull");
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " has sent the connection request");
  } catch (err) {
    res.status(400).send("Error " + err.message);
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
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  // console.log("skills", data.skills);
  try {
    const ALLOWED_UPDATES = ["age", "skills", "lastName"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Invalid to update");
    }
    if (data.skills?.length > 10) {
      throw new Error("Cannot enter more then 10 skills");
    }
    const user = await UserSchema.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
    });
    res.send("User Updated successfully");
    // console.log(user);
  } catch (err) {
    res.status(400).send("Error Occurred" + err.message);
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
