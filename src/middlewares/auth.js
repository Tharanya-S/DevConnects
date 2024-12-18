const jwt = require("jsonwebtoken");
const UserSchema = require("../models/user");

const userAuth = async (req, res, next) => {
  // checking user authentication
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token!!!");
    }
    //decode the data using this token
    const decodedObj = await jwt.verify(token, "DevConnects$1206");
    const { _id } = decodedObj;
    const loggedInUser = await UserSchema.findById(_id).exec();
    req.user = loggedInUser;
    next();
  } catch (err) {
    res.status(401).send("Error " + err.message);
  }
};

module.exports = { userAuth };
