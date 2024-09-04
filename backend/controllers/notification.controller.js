import Notification from "../models/notification.model.js";
import { decrypt } from "../utils/cryptoUtils.js";

export const getUserNotifications = async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await Notification.find({ userId: userId });

        const decryptedNotifications = notifications.map((notification) => {
            const decryptedMessage = decrypt(notification.message);
            return { ...notification._doc, message: decryptedMessage };
        });

        res.status(200).json(decryptedNotifications);
    } catch (error) {
        console.log("Error in getUserNotifications controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const markNotificationAsSeen = async (req, res) => {
    const { id } = req.params;

    try {
        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        await Notification.findByIdAndDelete(id);

        res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        console.log("error in markNotificationAsSeen: ", error.message);
        res.status(500).json({ error: "Error deleting notification" });
    }
};
