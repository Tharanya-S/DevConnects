const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestSchema = require("../models/userConnection");
const UserSchema = require("../models/user");

const userRouter = express.Router();

userRouter.get("/users/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestSchema.find({
      toUserId: loggedInUser._id.toString(),
      status: "interested",
    })
      .populate("fromUserId", ["firstName", "lastName", "photoUrl"])
      .exec();

    res.json({
      message: "The list of request received",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestSchema.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender"])
      .populate("toUserId", ["firstName", "lastName", "photoUrl", "gender"])
      .exec();

    const data = connectionRequest.map((request) => {
      if (loggedInUser._id.toString() === request.fromUserId._id.toString()) {
        //You cant compare 2 mongo db ids you have to convert it into toString()
        return request.toUserId;
      }

      return request.fromUserId;
    });

    res.json({ data: data });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    console.log("loggedInUser", loggedInUser);
    //Find all the connection request (sent and received)
    const connectionRequest = await ConnectionRequestSchema.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    // console.log("connectionRequest", connectionRequest);

    const previousRequests = new Set();
    //msp through the entire connection request and add the id of the people to the previousRequest list
    connectionRequest.forEach((req) => {
      previousRequests.add(req.toUserId.toString());
      previousRequests.add(req.fromUserId.toString());
    });

    // previousRequests.add(loggedInUser._id.toString());

    const data = await UserSchema.find({
      $and: [
        {
          _id: {
            $nin: Array.from(previousRequests),
          },
        },
        {
          _id: {
            $ne: loggedInUser._id,
          },
        },
      ],
    })
      .select("firstName lastName skills age photoUrl gender")
      .limit(limit)
      .skip(skip);
    console.log("data", data);
    res.json({ data: data });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

module.exports = userRouter;
