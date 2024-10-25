const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // get info about user by his token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // check if the user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      message: "The user belonging to this token does no longer exist.",
    });
  }
  req.user = currentUser;
  next();
};

exports.isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};
