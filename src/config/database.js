import mongoose from "mongoose";

async function connectDB() {
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Error in connecting Database",error)
    }   
}

export default connectDB;