import express from 'express';
const router = express.Router();
import gravatar from 'gravatar/lib/gravatar.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import jwt from 'jsonwebtoken';
import config from 'config';
import { check, validationResult } from 'express-validator'; // we use express-validator for validation
import User from '../../models/User.js';

//@route POST users/add
//@register user
//@access Public
router.post(
    '/register',
    [
        check('name', 'Name is Required').not().isEmpty(), //validation performed
        check('email', 'Email is required').isEmail(),
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
                credits: 30
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

export default router;