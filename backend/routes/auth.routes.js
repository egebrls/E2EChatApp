import express from "express";
import {
    signup,
    login,
    logout,
    deleteUser,
    getProfile,
    resendEmail,
} from "../controllers/auth.controller.js";
import Token from "../models/token.js";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/register", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/profile/:username", getProfile);

router.post("/resendemail", resendEmail);

router.get("/confirm/:token", async (req, res) => {
    try {
        const token = await Token.findOne({ token: req.params.token });
        //console.log(token);
        await User.updateOne({ _id: token.userId }, { isVerified: true });
        await Token.findByIdAndDelete(token._id);
        res.send("Email is verified");
        // YÖNLENDİRME BURADAN GERÇEKLEŞECEK. res.redirect("/")
    } catch (error) {
        res.status(400).send("Invalid token");
    }
});

router.post("/delete", deleteUser);

export default router;
