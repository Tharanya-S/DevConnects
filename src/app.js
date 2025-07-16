const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const authRouter = require("./routes/authRouter");//signup, login,logout
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
