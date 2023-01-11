import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true, //it is required!
        unique: true, //for email should be unique
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now, // by default set current date
    },
    credits: {
        type: Number,
        default: 30,
    },

});

let User = mongoose.model('user', UserSchema); //first parameter shows the collection name created on mongodb 'user'
export default User;