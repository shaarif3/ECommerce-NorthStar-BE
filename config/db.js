import mongoose from 'mongoose';
import config from 'config';
const db = config.get('mongoURI');

const connectDB = async () => {
    mongoose.connect(db);
    mongoose.connection.once('open', () => {
        console.log('MongoDB is connected...');
    });
};

export default connectDB;