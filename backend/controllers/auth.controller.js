import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { decrypt, encrypt, hashUsername } from "../utils/cryptoUtils.js";
import Token from "../models/token.js";
import crypto from "crypto";
import verifmail from "../utils/verificationmail.js";

export const signup = async (req, res) => {
    try {
        const { fullName, userName, password, confirmPassword, email, gender } =
            req.body;

        if (!["Male", "Female"].includes(gender)) {
            return res.status(400).json({ error: "Invalid gender" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const users = await User.find();
        let user;
        for (const finduser of users) {
            if (decrypt(finduser.userName) === userName) {
                user = finduser;
            }
        }

        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }
        //EMAİL KONTROLÜ, BÜTÜN KULLANICILARIN EMAİLLERİNİ DECRYPT EDİP KONTROL ETMEK
        // Alternatif varsa düşünülmeli, sistemi yorabilir.

        const decryptedEmails = users.map((user) => decrypt(user.email));

        if (decryptedEmails.includes(email)) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const encUserName = encrypt(userName);
        const newUser = new User({
            fullName: encrypt(fullName),
            userName: encUserName,
            password: hashedPassword,
            email: encrypt(email),
            gender,
            profilePic:
                gender === "Male"
                    ? `https://avatar.iran.liara.run/public/boy?username=${encUserName}`
                    : `https://avatar.iran.liara.run/public/girl?username=${encUserName}`,
            isVerified: false,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: fullName,
                userName: userName,
                email: email,
                gender,
                profilePic: newUser.profilePic,
                isVerified: false,
            });
            //TOKEN OLUŞTURMA VE KAYDETME İŞLEMİ
            const token = new Token({
                userId: newUser._id,
                token: crypto.randomBytes(16).toString("hex"),
            });
            await token.save();
            //console.log(token);
            //TOKEN OLUŞTURMA VE KAYDETME İŞLEMİ SONU
            //EMAİL GÖNDERME İŞLEMİ
            const link = `http://localhost:5000/api/auth/confirm/${token.token}`;
            await verifmail(email, link);
            //console.log("Email verified succsessfully.");
            // RETURN EDİLECEK PAGE
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const users = await User.find();
        let user;
        for (const finduser of users) {
            if (decrypt(finduser.userName) === userName) {
                user = finduser;
            }
        }

        if (!user) {
            console.log(`User not found: ${userName}`);
            return res
                .status(400)
                .json({ error: "Invalid username or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            console.log(`Password does not match for user: ${userName}`);
            return res
                .status(400)
                .json({ error: "Invalid username or password" });
        }
        //EMAİL VERİFİCAİTON TEST
        if (!user.isVerified) {
            return res.status(400).json({
                error: "Email is not verified",
                email: decrypt(user.email),
            });
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: decrypt(user.fullName),
            userName: decrypt(user.userName),
            email: decrypt(user.email),
            gender: decrypt(user.gender),
            profilePic: user.profilePic,
            isVerified: user.isVerified,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getProfile = async (req, res) => {
    const username = req.params.username;
    const users = await User.find();
    let user;
    for (const finduser of users) {
        if (decrypt(finduser.userName) === username) {
            user = finduser;
        }
    }

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json({
        _id: user._id,
        fullName: decrypt(user.fullName),
        userName: decrypt(user.userName),
        email: decrypt(user.email),
        gender: decrypt(user.gender),
        profilePic: user.profilePic,
    });
};

export const deleteUser = async (req, res) => {
    try {
        const { userName } = req.body;
        const users = await User.find();
        let user;
        for (const finduser of users) {
            if (decrypt(finduser.userName) === userName) {
                user = finduser;
            }
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await User.findByIdAndDelete(user._id);
        await Token.deleteMany({ userId: user._id });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log("Error in delete user controller", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const findUserMail = async (req, res) => {
    try {
        const { userName } = req.body;
        const users = await User.find();
        let user;
        for (const finduser of users) {
            if (decrypt(finduser.userName) === userName) {
                user = finduser;
            }
        }
        const email = decrypt(user.email);
        //console.log(email);
        return email;
    } catch (error) {
        console.log("Error in find user mail controller", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const resendEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const users = await User.find();
        for (const user of users) {
            const decryptedEmail = decrypt(user.email);
            if (decryptedEmail === email) {
                try {
                    const userToken = await Token.findOne({ userId: user._id });
                    const link = `http://localhost:5000/api/auth/confirm/${userToken.token}`;
                    verifmail(email, link);
                    res.status(200).json({
                        message: "Email sent successfully",
                    });
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
