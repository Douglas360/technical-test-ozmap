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

const close = async function () {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error(error);
  }
};

export { init, close }; // Exporta a função init sem executá-la imediatamente
