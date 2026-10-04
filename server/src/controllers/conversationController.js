const {
  findOrCreateDirectConversation
} = require("../services/conversationService");

const createDirectConversation = async (req, res, next) => {
  try {
    const { userId, otherUserId } = req.body;

    if (!userId || !otherUserId) {
      return res.status(400).json({
        success: false,
        message: "userId and otherUserId are required"
      });
    }

    const conversation = await findOrCreateDirectConversation(
      userId,
      otherUserId
    );

    res.status(201).json({
      success: true,
      conversation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDirectConversation
};