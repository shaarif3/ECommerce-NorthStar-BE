import generateToken from "../utils/generateJwtToken.js";
import { check, validationResult } from 'express-validator';
import Admin from "../models/AdminModel.js";
import User from "../models/UserModel.js";
import Reset from "../models/ResetModel.js";
import { queries } from "../queries/index.js";
// import verifyPassword from "../queries/index.js";
// import generateHash from "../queries/index.js";
import generateCode from "../services/generateCode.js";
import generateEmail from "../services/generateEmail.js";

const { comparePassword, createResetToken } = queries;
//admin
const registerAdmin = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const adminExist = await Admin.findOne({ email });
    try {
        if (adminExist) {
            return res.status(400).json({ msg: "Admin already Exists" });
        }
        const admin = new Admin({
            firstName,
            lastName,
            email,
            password,
        });
        console.log("Admin-Created", admin);
        await admin.save();
        let token = generateToken(admin._id);
        return res
            .status(201)
            .json({ message: "Admin Registered Successfull", token });
    } catch (err) {
        return res.status(500).json({ msg: "Server Error" });
    }
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    try {
        if (admin && (await admin.matchPassword(password))) {
            await admin.save();
            console.log("LoggedIn-Admin", admin);
            let token = generateToken(admin._id);
            return res.status(200).json({ message: "Log in Successfull", token });
        } else {
            return res.status(401).json({ msg: "Invalid Credentials" });
        }
    } catch (err) {
        return res.status(500).json({ msg: "Server Error" });
    }
};

const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select("-password");
        return res.json(admin);
    } catch (err) {
        console.error(err.message);
    }
};

const adminRecoverPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ msg: "Invalid email" });
        }
        const code = generateCode();
        await createResetToken(email, code);
        const html = `<p> your recovery code ${code} with this code you code you can recover your pw</p>`;
        await generateEmail(email, "VirtualRetreat- Password Reset", html);
        res
            .status(201)
            .json({ msg: "The recovery mail was sent to your registered email" });
    } catch (err) {
        console.log("Err");
        return res.status(401).json({ msg: "Server Error" });
    }
};

const adminVerifyRecoverCode = async (req, res) => {
    const { code } = req.body;
    console.log("req", req.body);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const reset = await Reset.findOne({ code });
        if (reset) {
            return res.status(200).json({ msg: "Recovery code Accepted" });
        } else {
            return res.status(401).json({ msg: "Invalid Code or Email" });
        }
    } catch (err) {
        console.log("err", err);
        return res.status(400).json({ msg: "Server Error" });
    }
};

const adminResetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log("Reset");
        const { email, code, password, confirm_password } = req.body;
        if (!comparePassword(password, confirm_password))
            return res.status(400).json({ message: "Password does not match" });
        const reset = await Reset.findOne({ email, code });
        console.log("reset", reset);
        if (!reset)
            return res.status(400).json({ message: "Invalid Recovery status" });
        else {
            const updatedadmin = await Admin.findOne({ email });
            updatedadmin.password = password;
            await updatedadmin.save();
            console.log("updatedadmin", updatedadmin);
            const token = generateToken(updatedadmin._id);
            return res
                .status(200)
                .json({ msg: "password reseted successfully", token });
        }
    } catch (err) {
        console.log("Error", err);
        return res.status(500).json({ msg: "Server Error" });
    }
};

const verifyAndResetPassword = async (req, res) => {
    try {
        console.log("reset");

        const { existingpassword, newpassword, confirm_password } = req.body;

        console.log("req.body", req.body);
        const admin = await Admin.findOne({ _id: req.admin._id });
        console.log("adminId", req.admin._id);
        if (admin && (await admin.matchPassword(existingpassword))) {
            console.log("block1");
            if (!comparePassword(newpassword, confirm_password)) {
                console.log("block2");
                return res.status(400).json({ message: "Password does not match" });
            } else {
                console.log("block3");
                admin.password = newpassword;
                await admin.save();
                console.log("admin", admin);
                res.status(201).json({
                    _id: admin._id,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    email: admin.email,
                    userImage: admin.userImage,

                    token: generateToken(admin._id),
                });
            }
        } else {
            console.log("block4");

            return res.status(401).json({ message: "Wrong Password" });
        }
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const editProfile = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        let user_image =
            req.files &&
            req.files.reciepts &&
            req.files.reciepts[0] &&
            req.files.reciepts[0].path;
        const admin = await Admin.findOne();
        admin.firstName = firstName ? firstName : admin.firstName;
        admin.lastName = lastName ? lastName : admin.lastName;
        admin.email = email ? email : admin.email;
        admin.userImage = user_image ? user_image : admin.userImage;
        await admin.save();
        await res.status(200).json({
            msg: "Profile Updated Successfully",
            _id: admin._id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            userImage: admin.userImage,
            token: generateToken(admin._id),
        });
    } catch (err) {
        console.log("error", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

//user
const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { firstName, lastName, email, phone, password, confirm_password } =
            req.body;
        const userexists = await User.findOne({ email });
        if (userexists) {
            return res.status(400).json({ msg: "User Already Exists" });
        }
        if (!comparePassword(password, confirm_password)) {
            return res.status(400).json({ msg: "Password does not match" });
        }
        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            password,
        });
        await user.save();
        console.log("User-Created", user);
        const token = generateToken(user);
        return res
            .status(200)
            .json({ message: "User Created Successfully", token });
    } catch (err) {
        console.log("Error", err);
        return res.status(500).send({ msg: "Server Error" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    try {
        if (user && (await user.matchPassword(password))) {
            await user.save();
            console.log("LoggedIn-user", user);
            let token = generateToken(user._id);
            return res.status(200).json({ message: "Log in Successfull", token });
        } else {
            return res.status(401).json({ msg: "Invalid Credentials" });
        }
    } catch (err) {
        return res.status(500).json({ msg: "Server Error" });
    }
};

const editProfileUser = async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;
        let user_image =
            req.files &&
            req.files.reciepts &&
            req.files.reciepts[0] &&
            req.files.reciepts[0].path;
        const user = await User.findOne();
        user.firstName = firstName ? firstName : user.firstName;
        user.lastName = lastName ? lastName : user.lastName;
        user.phone = phone ? phone : user.phone;
        user.userImage = user_image ? user_image : user.userImage;
        await user.save();
        await res.status(200).json({
            msg: "Profile Updated Successfully",
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            userImage: user.userImage,
            token: generateToken(user),
        });
    } catch (err) {
        console.log("error", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        console.log("UserId", req.user._id);
        return res.json(user);
    } catch (err) {
        console.error(err.message);
    }
};

const verifyAndResetPasswordUser = async (req, res) => {
    try {
        console.log("reset");

        const { existingpassword, newpassword, confirm_password } = req.body;

        console.log("req.body", req.body);
        const user = await User.findOne({ _id: req.user._id });
        console.log("userId", req.user._id);
        if (user && (await user.matchPassword(existingpassword))) {
            console.log("block1");
            if (!comparePassword(newpassword, confirm_password)) {
                console.log("block2");
                return res.status(400).json({ message: "Password does not match" });
            } else {
                console.log("block3");
                user.password = newpassword;
                await user.save();
                console.log("user", user);
                res.status(201).json({
                    msg: "Password Updated Successfully",
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    userImage: user.userImage,

                    token: generateToken(user._id),
                });
            }
        } else {
            console.log("block4");

            return res.status(401).json({ message: "Wrong Password" });
        }
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const userRecoverPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "Invalid email" });
        }
        const code = generateCode();
        await createResetToken(email, code);
        const html = `<p> your recovery code ${code} with this code you code you can recover your pw</p>`;
        await generateEmail(email, "VirtualRetreat- Password Reset", html);
        res
            .status(201)
            .json({ msg: "The recovery mail was sent to your registered email" });
    } catch (err) {
        console.log("Err");
        return res.status(401).json({ msg: "Server Error" });
    }
};

const userVerifyRecoverCode = async (req, res) => {
    
    const { code } = req.body;
    console.log("req", req.body);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const reset = await Reset.findOne({ code });
        if (reset) {
            return res.status(200).json({ msg: "Recovery code Accepted" });
        } else {
            return res.status(401).json({ msg: "Invalid Code or Email" });
        }
    } catch (err) {
        console.log("err", err);
        return res.status(400).json({ msg: "Server Error" });
    }
};

const userResetPassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log("Reset");
        const { email, code, password, confirm_password } = req.body;
        if (!comparePassword(password, confirm_password))
            return res.status(400).json({ message: "Password does not match" });
        const reset = await Reset.findOne({ email, code });
        console.log("reset", reset);
        if (!reset)
            return res.status(400).json({ message: "Invalid Recovery status" });
        else {
            const updateduser = await User.findOne({ email });
            updateduser.password = password;
            await updateduser.save();
            console.log("updateduser", updateduser);
            const token = generateToken(updateduser._id);
            return res
                .status(200)
                .json({ msg: "password reseted successfully", token });
        }
    } catch (err) {
        console.log("Error", err);
        return res.status(500).json({ msg: "Server Error" });
    }
};

export const authFunc = {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    adminRecoverPassword,
    adminVerifyRecoverCode,
    adminResetPassword,
    verifyAndResetPassword,
    editProfile,
    registerUser,
    loginUser,
    editProfileUser,
    getUserProfile,
    verifyAndResetPasswordUser,
    userRecoverPassword,
    userVerifyRecoverCode,
    userResetPassword,
};
