import express from "express";
import multer from "multer";
import path from "path";
import protectRoute from "../middleware/protectRoute.js";
import {
    createGroupChat,
    addUserToGroupChat,
    removeUserFromGroupChat,
    sendMessageInGroupChat,
    removeGroupChat,
    groupChatInfo,
    getGroupChatMessages,
} from "../controllers/groupChat.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/create", protectRoute, createGroupChat);
router.post("/addUser/:id", protectRoute, addUserToGroupChat);
router.post("/removeUser/:id", protectRoute, removeUserFromGroupChat);
router.post(
    "/sendMessage/:id",
    protectRoute,
    upload.single("file"),
    sendMessageInGroupChat
);
router.delete("/removeGroup/:id", protectRoute, removeGroupChat);
router.get("/info/:id", protectRoute, groupChatInfo);
router.get("/getMessages/:id", protectRoute, getGroupChatMessages);

export default router;
