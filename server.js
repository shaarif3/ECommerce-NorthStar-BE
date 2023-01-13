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
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
PassportFunc(passport)
//Connect the DB
connectDB();

//init middleware
app.use(express.json({ extended: false })); // this line allow us to get data object in post api req.body

app.get('/', (req, res) => res.send('ECommerce North-Star Server is Running'));

//Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
// app.use('/users', users);
// app.use('/auth', auth);
// app.use('/profile', profile);
// app.use('/posts', posts);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));