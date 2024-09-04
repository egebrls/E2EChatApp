import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { encrypt, decrypt } from "../utils/cryptoUtils.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const sendMessage = async (req, res) => {
    try {
        //console.log(req.body); // log the request body
        //console.log(req.file); // log the file

        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        /* if (!message.trim()) {
            // show an error message and return
        } */

        const file = req.file;

        const senderUser = await User.findById(senderId);
        const receiverUser = await User.findById(receiverId);
        if (!senderUser || !receiverUser) {
            return res.status(404).json({ error: "User not found" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const encryptedMessage = encrypt(message);

        const newMessage = new Message({
            senderId,
            senderName: senderUser.fullName,
            receiverId,
            receiverName: receiverUser.fullName,
            message: encryptedMessage,
            filePath: file != null ? encrypt(file.path) : null,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        // Create a new notification for the receiver
        const newNotification = new Notification({
            userId: receiverId, // The ID of the user who will receive the notification
            messageId: newMessage._id, // The ID of the new message
            senderId: senderId, // The ID of the user who sent the message
            message: encrypt(
                `New message from ${decrypt(senderUser.fullName)}`
            ), // The content of the message
        });
        await newNotification.save();

        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            // Convert the Mongoose document to a plain JavaScript object before emitting it
            const notificationToSend = {
                ...newNotification.toObject(),
                message: decrypt(newNotification.message),
            };
            io.to(receiverSocketId).emit("newNotification", notificationToSend);
        }

        const decryptedMessage = {
            ...newMessage._doc,
            senderName: decrypt(newMessage.senderName),
            receiverName: decrypt(newMessage.receiverName),
            message: decrypt(newMessage.message),
            filePath: decrypt(newMessage.filePath),
        };

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", decryptedMessage);
        }

        res.status(201).json(decryptedMessage);
    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate({
            path: "messages",
            model: "Message",
        });

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages.map((message) => {
            try {
                return {
                    ...message._doc,
                    senderName: decrypt(message.senderName),
                    receiverName: decrypt(message.receiverName),
                    message: decrypt(message.message),
                    filePath: decrypt(message.filePath),
                };
            } catch (error) {
                console.log("Error decrypting message:", message);
                throw error;
            }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
