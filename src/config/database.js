const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://tharanyasugumaran:M7q2l0RymvyJ1UTR@mynode.ffmuq.mongodb.net/devConnects"
  );
};

module.exports = { connectDB };
