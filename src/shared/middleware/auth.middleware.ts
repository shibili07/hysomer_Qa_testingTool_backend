import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { getAuthCookieOptions } from "../auth-cookies.ts";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied"
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret) as { id?: string; typ?: string };
    if (decoded.typ === "refresh") {
      return res.status(401).json({
        success: false,
        message: "Invalid token for this request",
      });
    }
    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("token", getAuthCookieOptions());
    return res.status(401).json({
      success: false,
      message: "Token is not valid"
    });
  }
};

// Also export as 'protect' for compatibility if needed
export const protect = authMiddleware;