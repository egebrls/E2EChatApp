import User from "../models/user.model.js";
import GroupChat from "../models/groupChat.model.js";
import bcrypt from "bcryptjs";
import { hashUsername, decrypt } from "../utils/cryptoUtils.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const filteredUsers = await User.find({
            _id: { $ne: loggedInUser },
        }).select("-password");

        const groupChats = await GroupChat.find({
            users: { $in: [loggedInUser] },
        });

        const decryptedUsers = filteredUsers.map((user) => {
            const decryptedFullName = decrypt(user.fullName);
            const decryptedEmail = decrypt(user.email);
            const decryptedUserName = decrypt(user.userName);
            const profilePic = user.profilePic;
            const gender = decrypt(user.gender);
            const _id = user._id;

            return {
                _id,
                fullName: decryptedFullName,
                userName: decryptedUserName,
                email: decryptedEmail,
                profilePic,
                gender,
            };
        });

        const decryptedGroupChats = groupChats.map((groupChat) => {
            return {
                ...groupChat._doc,
                name: decrypt(groupChat.name),
            };
        });

        return res
            .status(200)
            .json({ users: decryptedUsers, groupChats: decryptedGroupChats });
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
