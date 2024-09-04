import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupChat: { type: mongoose.Schema.Types.ObjectId, ref: "GroupChat" }, // Add this line
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
