
const {
  getMyProfile,
  updateMyProfile
} = require("../services/userService");

const getProfile = async (req, res, next) => {
  try {
    const user = await getMyProfile(req.user.id);

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await updateMyProfile(req.user.id, req.body);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
