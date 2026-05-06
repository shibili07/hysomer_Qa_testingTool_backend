import type { Response } from "express";
import { loginSchema } from "./auth.schema.ts";
import { loginAdmin } from "./auth.service.ts";
import type { AuthRequest } from "../../shared/middleware/auth.middleware.ts";
import { UserModel } from "./auth.model.ts";
import { asyncHandler } from "../../shared/utils/asyncHandler.ts";
import { AppError } from "../../shared/utils/AppError.ts";


export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = loginSchema.parse(req.body);

    const { token } = await loginAdmin(data.email, data.password);

    res.cookie("token", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",       
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ 
        success: true,
        message: "Login successful", 
        token 
    });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
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



