const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Here is the Testing page");
});

app.use("/hello", (req, res) => {
  res.send("Hello World !!!");
});

app.get("/user", (req, res) => {
  res.send({ firstName: "Tharanya", lastName: "Sugumaran" });
});

app.post("/user", (req, res) => {
  //Logic to add data
  res.send("Users added successfully");
});

app.patch("/user", (req, res) => {
  res.send("Patched user successfully");
});

app.delete("/user", (req, res) => {
  res.send("Deleted user successfully");
});

app.use("/", (req, res) => {
  res.send("Server Running Successfully");
}); //this should always come at time as '/' is the prefix for all route

app.listen(7777, () => {
  console.log("Server running successfully on Port : 7777");
});
