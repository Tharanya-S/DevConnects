const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Id");
        }
      },
    },
    password: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 18,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("You have entered invalid gender");
        }
      },
    },
    skills: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSchema", UserSchema);
