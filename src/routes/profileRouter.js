const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.send(loggedInUser);
  } catch (err) {
    res.status(400).send("Login unsuccessfull");
  }
});

module.exports = profileRouter;
