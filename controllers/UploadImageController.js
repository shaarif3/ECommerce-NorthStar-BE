
import cloudinary from "cloudinary";

const uploadImage = async (req, res) => {
    console.log(req, "maaz")
    try {
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = await cloudinary.v2.uploader.upload(path);
            urls.push(newPath.secure_url);
        }

        res.status(201).json({
            success: true,
            urls,
        });
    } catch (err) {
        res.json({ message: err });
    }
};
export const uploadImageFunc = {
    uploadImage,
};
