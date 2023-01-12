import express from 'express';
import { check, validationResult } from 'express-validator'; // we use express-validator for validation
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
import { authFunc } from "../controllers/authController.js"
// import {
//     registerAdmin,
//     loginAdmin,
//     getAdminProfile,
//     adminRecoverPassword,
//     adminVerifyRecoverCode,
//     adminResetPassword,
//     verifyAndResetPassword,
//     editProfile,
//     registerUser,
//     loginUser,
//     editProfileUser,
//     getUserProfile,
//     verifyAndResetPasswordUser,
//     userRecoverPassword,
//     userVerifyRecoverCode,
//     userResetPassword,
// } from "../controllers/authController.js";

const { registerAdmin,
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
    userResetPassword } = authFunc;

router.post(
    "/adminRegister",
    [
        check("firstname", "firstname is required").not().isEmpty(),
        check("lastname", "last name is required").not().isEmpty(),
        check("email", "email address is required").isEmail(),
        check("password", "Enter a password of lenght greater than 6").isLength({
            min: 7,
        }),
    ],
    registerAdmin
);

router.post(
    "/adminLogin",
    [
        check("email", "email address is required").isEmail(),
        check("password", "password is required").exists(),
    ],
    loginAdmin
);

router.get("/getProfile", authMiddleware, getAdminProfile);

router.post(
    "/adminRecoverPassword",
    [check("email", "email address is required").isEmail()],
    adminRecoverPassword
);

router.post(
    "/adminVerifyRecoverCode",
    [check("code", "code is required").exists()],
    adminVerifyRecoverCode
);

router.post(
    "/adminResetPassword",
    [check("password", "password required").exists()],
    adminResetPassword
);

router.post(
    "/AdminverifyAndResetPassword",
    [
        check("email", "email address is required").isEmail(),
        check("password", "password is required").exists(),
        check("existingpassword", "existingpassword is required").exists(),
        authMiddleware,
    ],
    verifyAndResetPassword
);

router.post("/editProfile", authMiddleware, editProfile);

router.post(
    "/registerUser",
    [
        check("firstName", "firstname is required").not().isEmpty(),
        check("lastName", "last name is required").not().isEmpty(),
        check("email", "email address is required").isEmail(),
        check("password", "Enter a password of lenght greater than 6").isLength({
            min: 7,
        }),
        check("phone", "phone is required").isNumeric().isLength({ max: 15 }),
    ],
    registerUser
);

router.post(
    "/userLogin",
    [
        check("email", "email address is required").isEmail(),
        check("password", "password is required").exists(),
    ],
    loginUser
);

router.get("/getUserProfile", authMiddleware, getUserProfile);

router.post(
    "/userRecoverPassword",
    [check("email", "email address is required").isEmail()],
    userRecoverPassword
);

router.post(
    "/userVerifyRecoverCode",
    [check("code", "code is required").exists()],
    userVerifyRecoverCode
);

router.post(
    "/userResetPassword",
    [check("password", "password required").exists()],
    userResetPassword
);

router.post(
    "/UserverifyAndResetPassword",
    [
        check("email", "email address is required").isEmail(),
        check("password", "password is required").exists(),
        check("existingpassword", "existingpassword is required").exists(),
        authMiddleware,
    ],
    verifyAndResetPasswordUser
);

router.post("/editUserProfile", authMiddleware, editProfileUser);

// module.exports = router;
export default router;
