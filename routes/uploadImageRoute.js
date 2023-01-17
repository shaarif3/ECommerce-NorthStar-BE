import express from "express";
const router = express.Router();
import { uploadImageFunc } from "../controllers/UploadImageController.js"
import { multerFunc } from "../utils/multer.js";
const { upload } = multerFunc;
const {
    uploadImage,
} = uploadImageFunc;
router.post("/upload", upload.array("file"), uploadImage);

export default router;
