const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEdit } = require("../utils/validations");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.send(loggedInUser);
  } catch (err) {
    res.status(400).send("Login unsuccessfull");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      throw new Error("User Not logged In");
    }

    if (!validateEdit(req)) {
      throw new Error("Given fields cannot be updated");
    }

    //Now update the fields with the incomming data
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    //save the edited fields
    await loggedInUser.save();

    //send respose
    res.json({
      message: `${loggedInUser.firstName} profile edited successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(401).send("Error" + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //checking if the user is logged in or not
    if (!loggedInUser) {
      throw new Error("User not logged In");
    }

    //getting old Password from the user
    const oldPassword = req.body.oldPassword;

    //Check if the old password is matching
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      loggedInUser.password
    );

    if (!isPasswordMatch) {
      throw new Error("Incorrect Password");
    }

    //Now if the old password matches
    //get the new password
    const newPassword = req.body.newPassword;

    //check if the new Password is strong
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Please enter strong password");
    }

    //encrypt the new Password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = newPasswordHash;

    loggedInUser.save();

    res.send("Password Changes Succcessfully");
  } catch (err) {
    res.status(401).send("Error " + err.message);
  }
});

module.exports = profileRouter;

// old =>$2b$10$x7bH1bkF5Mb4CO7fS2Whf.WnNScKMo4zKmYBfnVYlKVT/GHW.X3yS
// new =>$2b$10$cBXPCy1SOYMCRDuFJYmBuubAiMub.ch9wOoLlhYJLXFHkyuVCyCCG
