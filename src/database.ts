import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const init = async function () {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};

export default init();
