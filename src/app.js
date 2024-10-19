const express = require("express");

const app = express();

app.get("/user", [
  (req, res, next) => {
    console.log("Route Handler 1");
    // res.send("Route Handler 1");
    next();
  },
  [
    (req, res, next) => {
      // res.send("Route Handler 2");
      console.log("Route Handler 2");
      next();
    },
    (req, res, next) => {
      // res.send("Route Handler 3");
      console.log("Route Handler 3");
      next();
    },
  ],
  (req, res, next) => {
    // res.send("Route Handler 4");
    console.log("Route Handler 4");
    next();
  },
  (req, res) => {
    console.log("Route Handler 5");
    res.send("Route Handler 5");
  },
]);

app.listen(7777, () => {
  console.log("Server running successfully on Port : 7777");
});
