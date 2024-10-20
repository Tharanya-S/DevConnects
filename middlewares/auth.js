const adminAuth = (req, res, next) => {
  //check if the admin is authenticated
  console.log("Admin authentication in progress...");
  const token = "xyz";
  const adminAuthentication = token === "xyz";
  console.log("adminAuthentication", adminAuthentication);
  if (adminAuthentication) {
    next();
  } else {
    res.status(401).send("Unauthorized Admin");
  }
};

const userAuth = (req, res, next) => {
  // checking user authentication
  console.log("User authentication in progress");
  const userToken = "abc";
  const userAuthentication = userToken === "abc";
  if (!userAuthentication) {
    res.status(404).send("Unauthorized user");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
