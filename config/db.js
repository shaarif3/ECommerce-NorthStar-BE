import mongoose from 'mongoose';
import config from 'config';
// const db = config.get('mongoURI');


const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB is connected...');


    } catch (err) {
        console.log("not connected");
        console.error(err.message);
        process.exit(1);
    }

};

export default connectDB;