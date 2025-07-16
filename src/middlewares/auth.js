const jwt = require("jsonwebtoken");
const UserSchema = require("../models/user");

const userAuth = async (req, res, next) => {
  // checking user authentication
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Please login!");
    }
    //decode the data using this token
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;
    const loggedInUser = await UserSchema.findById(_id).exec();
    req.user = loggedInUser;
    next();//very important to move to request handler
  } catch (err) {
    res.status(401).send("Error " + err.message);
  }
};

module.exports = { userAuth };

//Read the token from the req cookies
//Validate the token
//Find the user