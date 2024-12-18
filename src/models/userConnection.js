const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserSchema",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserSchema",
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "rejected", "interested", "ignored"],
        message: [`{VALUES} is not accepted `],
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Compound index on fromUserId and toUserId in the ascending order
ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

ConnectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  //validating with pre
  if (connectionRequest.fromUserId.equals(this.toUserId)) {
    throw new Error("The to and from user Id are same");
  }
});

module.exports = mongoose.model(
  "ConnectionRequestSchema",
  ConnectionRequestSchema
);
