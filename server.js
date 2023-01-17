import express from 'express';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import passport from 'passport';
import { PassportFunc } from './middleware/passport.js';
import cors from "cors";
// import users from './config/routes/api/users.js';
// import auth from './config/routes/api/auth.js';
// import profile from './config/routes/api/profile.js';
// import posts from './config/routes/api/posts.js';
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import uploadImageRoute from "./routes/uploadImageRoute.js";

import bodyParser from 'body-parser';
// const { fileStorage, fileFilter } = multerFunc;
// import cloudinary from "cloudinary";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
PassportFunc(passport)
//Connect the DB
connectDB();
//add cloudinary
// cloudinary.v2.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET
// })
//init middleware of multer
// app.use(
//     multer({
//         storage: fileStorage,
//         fileFilter: fileFilter,
//     }).fields([
//         {
//             name: "reciepts",
//             maxCount: 5,
//         },
//         {
//             name: "contentFiles",
//             maxCount: 5,
//         },
//     ])
// );
//init middleware
app.use(express.json({ extended: false })); // this line allow us to get data object in post api req.body
app.get('/', (req, res) => res.send('ECommerce North-Star Server is Running'));

//Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/image", uploadImageRoute);
// app.use('/users', users);
// app.use('/auth', auth);
// app.use('/profile', profile);
// app.use('/posts', posts);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));