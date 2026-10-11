
const mongoose = require("mongoose");
const User = require("../models/User");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getMyProfile = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw createError("Invalid user ID", 400);
  }

  const user = await User.findById(userId).select(
    "name email avatarUrl status lastSeen createdAt updatedAt"
  );

  if (!user) {
    throw createError("User not found", 404);
  }

  return user;
};

const updateMyProfile = async (userId, updates) => {
  if (!mongoose.isValidObjectId(userId)) {
    throw createError("Invalid user ID", 400);
  }

  const allowedFields = ["name", "avatarUrl"];
  const receivedFields = Object.keys(updates);

  const invalidFields = receivedFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw createError(
      `Fields cannot be updated: ${invalidFields.join(", ")}`,
      400
    );
  }

  const changes = {};

  if (Object.hasOwn(updates, "name")) {
    if (typeof updates.name !== "string") {
      throw createError("Name must be a string", 400);
    }

    const name = updates.name.trim();

    if (!name || name.length > 50) {
      throw createError("Name must contain 1 to 50 characters", 400);
    }

    changes.name = name;
  }

  if (Object.hasOwn(updates, "avatarUrl")) {
    if (typeof updates.avatarUrl !== "string") {
      throw createError("Avatar URL must be a string", 400);
    }

    const avatarUrl = updates.avatarUrl.trim();

    if (
      avatarUrl &&
      (!URL.canParse(avatarUrl) ||
        new URL(avatarUrl).protocol !== "https:")
    ) {
      throw createError("Avatar URL must use HTTPS", 400);
    }

    changes.avatarUrl = avatarUrl;
  }

  if (Object.keys(changes).length === 0) {
    throw createError("Provide a name or avatarUrl to update", 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: changes },
    {
      new: true,
      runValidators: true
    }
  ).select("name email avatarUrl status lastSeen createdAt updatedAt");

  if (!user) {
    throw createError("User not found", 404);
  }

  return user;
};

module.exports = {
  getMyProfile,
  updateMyProfile
};
