const cloudinary = require('cloudinary').v2;
import dotenv from "dotenv";

dotenv.config();

// console.log(process.env.CLOUDINARY_API_KEY, "api key")
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

module.exports = cloudinary;