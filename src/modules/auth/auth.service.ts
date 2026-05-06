import { UserModel } from "./auth.model.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

function requireSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return secret;
}

export function issueAccessToken(userId: string): string {
  const secret = requireSecret();
  return jwt.sign({ id: userId, typ: "access" }, secret, { expiresIn: ACCESS_TTL });
}

export function issueRefreshToken(userId: string): string {
  const secret = requireSecret();
  return jwt.sign({ id: userId, typ: "refresh" }, secret, { expiresIn: REFRESH_TTL });
}

export const loginAdmin = async (email: string, password: string) => {
  const admin = await UserModel.findOne({ email: email.toLowerCase() });

  if (!admin) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const userId = String(admin._id);
  return {
    accessToken: issueAccessToken(userId),
    refreshToken: issueRefreshToken(userId),
  };
};
