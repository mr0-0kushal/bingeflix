// Importing the mongoose package which is a overall ODM (Object Document Mapper) for MongoDB
import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

// Connecting to the database
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`MongoDB connected successfully \n Database Host: ${connectionInstance.connection.host} \n Database Name: ${connectionInstance.connection.name}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;