
const firebaseAuth = require("../config/firebaseAdmin");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required"
      });
    }

    const token = authorization.slice(7);
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    const user = await User.findOne({
      firebaseUid: decodedToken.uid
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found"
      });
    }

    req.user = {
      id: user._id.toString(),
      firebaseUid: decodedToken.uid
    };

    next();
  } catch (error) {
    if (error.code && error.code.startsWith("auth/")) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token"
      });
    }

    next(error);
  }
};

module.exports = requireAuth;
