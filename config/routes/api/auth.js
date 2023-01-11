import express from 'express';
const router = express.Router();
import auth from '../../../middleware/auth.js';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import jwt from 'jsonwebtoken';
import config from 'config';
import { check, validationResult } from 'express-validator'; // we use express-validator for validation
import gravatar from 'gravatar/lib/gravatar.js';
import OtpVerification from '../../models/OtpVerification.js';

//verify otp email
// router.post('/verifyOTP', async (req, res) => {
//     try {
//         let { userId, otp } = req.body;
//         if (!userId || !otp) {
//             throw Error("Empty otps are not allowed")
//         } else {
//             const UserOtpVerificationRecords = await OtpVerification.find({
//                 userId
//             });
//             if (UserOtpVerificationRecords.length <= 0) {
//                 throw new Error("Accounts record doesn't exist or has been verified already. please signup or login")
//             } else {
//                 const { expiresAt } = UserOtpVerificationRecords[0]
//                 const hashedOtp = UserOtpVerificationRecords[0].otp;
//                 if (expiresAt < Date.now()) {
//                     OtpVerification.deleteMany({ userId })
//                     throw new Error("code has expired, please request again.")
//                 } else {
//                     const validOtp = await bcrypt.compare(otp, hashedOtp)
//                     if (!validOtp) {
//                         throw new Error("Invalid code passed, check your inbox.")
//                     } else {
//                         await User.updateOne({ _id: userId }, {
//                             verified: true
//                         })
//                         await OtpVerification.deleteMany({ userId })
//                         res.json({
//                             status: "VERIFIED",
//                             message: "user email verified successfully. "
//                         })
//                     }
//                 }

//             }
//         }
//     } catch (error) {
//         res.json({
//             status: "FAILED",
//             message: error.message
//         })
//     }
// })

//@route POST users/add
//@register user
//@access Public
router.post(
    '/register',
    [
        check('name', 'Name is Required').not().isEmpty(), //validation performed
        check('email', 'Email is Required').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters.'
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        const { name, email, password } = req.body;
        try {
            //see if user exist
            let user = await User.findOne({ email });
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'User already exists' }] });
            }
            //Get users Gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm',
            });
            user = new User({
                name,
                email,
                avatar,
                password,

            });
            //Encrypt password using Bcrypt
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            //Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {
                    expiresIn: 360000, //means token expire after an hour 60x60=3600sec
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }
);






//@route GET api/auth
//@description Test route
//@access Public , bring you the user detail without password
router.get('/current-user', auth, async (req, res) => {
    // auth in it is the passport middleware
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
});

//@route POST auth/add  (login user)
//@authenticate user and get token
//@access Public
router.post(
    '/login',
    [
        //validation performed
        check('email', 'Email is required').isEmail(),
        check('password', 'Password is required.').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        const { email, password } = req.body;
        try {
            //see if user exist
            let user = await User.findOne({ email });
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            //Return jsonwebtoken
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {
                    expiresIn: 360000, //means token expire after an hour 60x60=3600sec
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }
);

export default router;
