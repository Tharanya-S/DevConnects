const express = require("express");

const app = express();

// app.use("/", (err, req, res, next) => {
//   res.status(500).send("Error in the Api");
// });

app.use("/admin", (req, res) => {
  throw new Error();
  res.send("Admin Api");
});

app.use("/user", (req, res) => {
  try {
    // throw new Error();
    res.send("User Api");
  } catch {
    res.status(500).send("Error in user Api");
  }
});

app.use("/", (err, req, res, next) => {
  //write this at the end always it is like a wildcard
  res.status(500).send("Error in the Api");
});

app.listen(7777, () => {
  console.log("Server running successfully on Port : 7777");
});
