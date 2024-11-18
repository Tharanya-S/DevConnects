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
      const fromUserId = req.params.userId; //sender
      const toUserId = req.user._id; //receiver
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

module.exports = requestRouter;
