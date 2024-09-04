import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            senderName: {
                type: String,
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
            filePath: {
                type: String,
                required: false,
            },
        },
    ],
});

const GroupChat = mongoose.model("GroupChat", groupChatSchema);

export default GroupChat;
