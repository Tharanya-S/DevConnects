const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestSchema = require("../models/userConnection");
const UserSchema = require("../models/user");

const userRouter = express.Router();

userRouter.get("/users/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest1 = await ConnectionRequestSchema.find({
      toUserId: loggedInUser._id.toString(),
      status: "interested",
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .exec();

    console.log(connectionRequest1);

    res.json({
      message: "The request received ",
      data: connectionRequest1,
    });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggendInUser = req.user;

    const connectionRequest = await ConnectionRequestSchema.find({
      $or: [
        { fromUserId: loggendInUser._id, status: "accepted" },
        { toUserId: loggendInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"])
      .exec();

    const data = connectionRequest.map((request) => {
      if (loggendInUser._id.toString() === request.fromUserId._id.toString()) {
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
    //validations or Checks
    // 1.Check that in the list of feed the loggedIn user should not be one of them
    // 2.Check if the list of feed should not be connected to loggedInuser

    const connectionRequest = await ConnectionRequestSchema.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const previousRequests = new Set();

    connectionRequest.forEach((req) => {
      previousRequests.add(req.toUserId.toString());
      previousRequests.add(req.fromUserId.toString());
    });

    const data = await UserSchema.find({
      _id: { $nin: Array.from(previousRequests) },
    }).select("firstName lastName skills age");

    res.json({ data: data });
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

// userRouter.get("/user/feed", userAuth, async (req, res) => {
//   try {
//     const loggedInUser = req.user;
//     //validations or Checks
//     // 1.Check that in the list of feed the loggedIn user should not be one of them
//     // 2.Check if the list of feed should not be connected to loggedInuser
//     const userConnections = await UserSchema.find({}).exec();

//     const data = userConnections.filter(
//       (connection) => connection._id.toString() !== loggedInUser._id.toString()
//     );

//     const loggedInUserConnections = await ConnectionRequestSchema.find({
//       $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
//     })
//       .populate("fromUserId", ["_id"])
//       .populate("toUserId", ["_id"]);

//     const presentConnectionList = loggedInUserConnections.map((request) => {
//       if (loggedInUser._id.toString() === request.toUserId._id.toString()) {
//         return request.fromUserId._id.toString();
//       }
//       return request.toUserId._id.toString();
//     });

//     const correctList = data.filter(
//       (request) => !presentConnectionList.includes(request._id.toString())
//     );

//     res.json({ data: data });
//   } catch (err) {
//     res.status(400).send("ERROR " + err.message);
//   }
// });

module.exports = userRouter;
