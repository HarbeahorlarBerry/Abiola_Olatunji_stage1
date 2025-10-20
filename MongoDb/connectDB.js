import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(" Connected ✅to MongoDB 📦");
        
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the app on DB failure
    }
};

export default connectDB;