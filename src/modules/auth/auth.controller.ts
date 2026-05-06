import type { Response } from "express";
import jwt from "jsonwebtoken";
import { loginSchema } from "./auth.schema.ts";
import { loginAdmin, issueAccessToken } from "./auth.service.ts";import type { AuthRequest } from "../../shared/middleware/auth.middleware.ts";
import { UserModel } from "./auth.model.ts";
import { asyncHandler } from "../../shared/utils/asyncHandler.ts";
import { AppError } from "../../shared/utils/AppError.ts";


const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = loginSchema.parse(req.body);

    const { accessToken, refreshToken } = await loginAdmin(data.email, data.password);

    res.cookie("token", accessToken, {
        ...cookieOpts,
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        ...cookieOpts,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ 
        success: true,
        message: "Login successful", 
        token: accessToken,
    });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

export const refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie) {
        throw new AppError("No refresh token", 401);
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new AppError("Server misconfiguration", 500);
    }

    let decoded: { id?: string; typ?: string };
    try {
        decoded = jwt.verify(refreshTokenCookie, secret) as { id?: string; typ?: string };
    } catch {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        throw new AppError("Invalid refresh token", 401);
    }

    if (decoded.typ !== "refresh" || !decoded.id) {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        throw new AppError("Invalid refresh token", 401);
    }

    const accessToken = issueAccessToken(decoded.id);
    res.cookie("token", accessToken, {
        ...cookieOpts,
        maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({
        success: true,
        token: accessToken,
    });
});
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
        throw new AppError("User not found", 404);
    }
    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            email: user.email,
            name: user.name
        }
    });
});




