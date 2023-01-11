import express from 'express';
import connectDB from './config/db.js';
import users from './config/routes/api/users.js';
import auth from './config/routes/api/auth.js';
// import profile from './config/routes/api/profile.js';
// import posts from './config/routes/api/posts.js';
import bodyParser from 'body-parser';
const app = express();

app.use(bodyParser.json());

//Connect DB
connectDB();

//init middleware
app.use(express.json({ extended: false })); // this line allow us to get data object in post api req.body

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/users', users);
app.use('/auth', auth);
// app.use('/profile', profile);
// app.use('/posts', posts);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));