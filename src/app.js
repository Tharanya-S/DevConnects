const express = require("express");
const { adminAuth, userAuth } = require("../middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.use("/admin/getAllAdmin", (req, res, next) => {
  res.send("Admin Data sent successfully");
  console.log("Admin authentication done successfully");
});

app.use("/user/login", (req, res) => {
  res.send("User logged in successfully");
});

app.use("/user/getUsersDetails", userAuth, (req, res, next) => {
  res.send("User details sent successfully");
  console.log("User data sent successfully");
});

app.listen(7777, () => {
  console.log("Server running successfully on Port : 7777");
});
