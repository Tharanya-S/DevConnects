const express = require("express");
const bcrypt = require("bcrypt");
const UserSchema = require("../models/user");
const { validateSignUpData } = require("../utils/validations");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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
  } catch (err) {
    res.status(401).send("User failed to update " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
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
      });

      res.send("Login successfull");
    } else {
      throw new Error("Invaild crendentials");
    }
  } catch (err) {
    res.status(401).send("Error : " + err.message);
  }
});

module.exports = authRouter;
