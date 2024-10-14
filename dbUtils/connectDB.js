import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    let conn = null;
    if (process.env.isLOCAL === "true") {
      conn = await mongoose.connect(
        `mongodb://${process.env.DB_URL}/${process.env.DB_NAME}`
      );
    } else {
      conn = await mongoose.connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.m2gkomc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
      );
    }
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
