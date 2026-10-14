
const {
  sendMessage,
  getConversationMessages
} = require("../services/messageService");

const createMessage = async (req, res, next) => {
  try {
    const { conversationId, text } = req.body;

    const message = await sendMessage(
      conversationId,
      req.user.id,
      text
    );

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { limit, before } = req.query;

    const messages = await getConversationMessages(
      conversationId,
      req.user.id,
      limit,
      before
    );

    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getMessages
};
