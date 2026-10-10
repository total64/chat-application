const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: ""
    },
    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text"
    },
    attachmentUrl: {
      type: String,
      default: ""
    },
    attachmentName: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

messageSchema.index({ conversation: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);