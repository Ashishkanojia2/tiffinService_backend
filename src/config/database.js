import mongoose from "mongoose";

export const connectDataBase = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo Connection : ", connection.host);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
