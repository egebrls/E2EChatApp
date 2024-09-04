import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        senderName: {
            type: String,
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverName: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        filePath: {
            type: String,
          },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
