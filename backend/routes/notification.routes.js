import express from "express";
import {
    getUserNotifications,
    markNotificationAsSeen,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:userId", getUserNotifications);
router.delete("/:id/seen", markNotificationAsSeen);

export default router;
