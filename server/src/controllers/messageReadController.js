const {
  markConversationAsRead
} = require("../services/messageReadService");

const markAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const result = await markConversationAsRead(
      conversationId,
      req.user.id
    );

    res.json({
      success: true,
      message: "Conversation marked as read",
      ...result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAsRead
};