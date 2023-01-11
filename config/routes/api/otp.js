import bcrypt from 'bcryptjs/dist/bcrypt.js';
import OtpVerification from '../../models/OtpVerification';

//Node EMailer Stuff
let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
})
const sendOtpVerificationEmail = async ({ _id, email }, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`
        //MAIL OPTIONS
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "verify your email",
            html: `<p>Enter <b>${otp}</b> as your OTP verification code. This code <b>expires in 1 hour</b>. </p>`
        }
        //hash the otp
        const saltRounds = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, saltRounds);
        const newOtpVerification = new OtpVerification({
            userId: _id,
            otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        })
        //save otp record
        await newOtpVerification.save();
        await transporter.sendMail(mailOptions);
        res.json({
            status: "PENDING",
            message: "Verification OTP email sent",
            data: {
                userId: _id,
                email,
            },
        })

    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        })
    }
}