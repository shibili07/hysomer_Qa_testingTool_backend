import { UserModel } from "./auth.model.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const loginAdmin = async (email: string, password: string) => {
  // Find user by email (lowercase)
  const admin = await UserModel.findOne({ email: email.toLowerCase() });

  if (!admin) {
    throw new Error("Invalid credentials");
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Ensure JWT_SECRET is available
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(
    { id: admin._id },
    secret,
    { expiresIn: "7d" }
  );

  return { token };
};
