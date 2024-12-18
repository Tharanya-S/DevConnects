const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestSchema = require("../models/userConnection");
const UserSchema = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; //sender
      const toUserId = req.params.userId; //receiver
      const status = req.params.status;

      //validations
      //1.if the request already exist and if the receiver of the request has already sent a request

      const requestExistCheck = await ConnectionRequestSchema.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (requestExistCheck) {
        throw new Error("Request already exist");
      }
      //2.Validate if the to User Id exist
      const isToUserIdExistCheck = await UserSchema.findById(toUserId).exec();

      if (!isToUserIdExistCheck) {
        throw new Error("The given user does not exist");
      }
      //3.Validate if the toUserId and FromUserId is not same
      // const userIdCheck = toUserId.equals(fromUserId);

      // if (userIdCheck) {
      //   throw new Error("The from and to user id are same !!!");
      // }

      //create a new instance for the connection request use the userRequest model
      const userConnectionRequest = new ConnectionRequestSchema({
        fromUserId,
        toUserId,
        status,
      });

      await userConnectionRequest.save();

      res.json({
        message: "User sent the request successfully",
        data: userConnectionRequest,
      });
    } catch (err) {
      res.status(400).send(`ERROR ` + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      // const requestId = req.params.requestId;
      // const status = req.params.status;
      const { requestId, status } = req.params;

      //validations
      //1.check if the status is correct
      const allowedStatusList = ["accepted", "rejected"];
      if (!allowedStatusList.includes(status)) {
        throw new Error("Incorrect status");
      }

      //2.Check if the request Id exist in the requestConnectionList
      const connectionRequest = await ConnectionRequestSchema.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Request does not exist");
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      res.json({
        message: `User ${status} the request`,
        data: connectionRequest,
      });
    } catch (err) {
      res.status(400).send("ERROR " + err.message);
    }
  }
);

module.exports = requestRouter;
