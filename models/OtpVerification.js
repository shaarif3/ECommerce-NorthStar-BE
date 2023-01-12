import mongoose from 'mongoose';

const OtpVerificationSchema = new mongoose.Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date
});

let OtpVerification = mongoose.model('otpVerification', OtpVerificationSchema); //first parameter shows the collection name created on mongodb 'user'
export default OtpVerification;



