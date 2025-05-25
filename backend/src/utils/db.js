import mongoose from "pg";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is not defined in environment variables.");
        }
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("MongoDB connected successfully.");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
export default connectDB;
