import * as dotenv from "dotenv";
dotenv.config();
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User, UserModel } from "../models/models";
import { CustomError } from "../utils/customError";

class SessionService {
  async create({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<string> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new CustomError("User not found!", 404);
      }
      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) {
        throw new CustomError("Email/Password incorrect", 401);
      }
      const token = sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });
      return token;
    } catch (error: any) {
      throw new CustomError(error.message);
    }
  }
}

export { SessionService };
