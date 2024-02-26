import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const initDb = async function () {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};

const closeDb = async function () {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error(error);
  }
};

const clearDb = async function () {
  try {
    await mongoose.connection.db.dropDatabase();
    console.log("Database Cleared");
  } catch (error) {
    console.log(error);
  }
};

export { initDb, closeDb, clearDb };
