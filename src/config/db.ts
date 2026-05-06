import mongoose from "mongoose";
import logger from "../shared/utils/logger.ts";

/** Fixes common typo `w=majori` → `w=majority` in connection strings (Atlas / replica sets). */
export function sanitizeMongoUri(uri: string): string {
  return uri
    .replace(/([?&])w=majori(?=&|$|#)/gi, "$1w=majority")
    .replace(/w%3Dmajori(?=%26|%23|$)/gi, "w%3Dmajority");
}

export const connectDB = async (): Promise<void> => {
    const raw = process.env.MONGO_URI?.trim();
    if (!raw) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }

    const MONGO_URI = sanitizeMongoUri(raw);
    if (MONGO_URI !== raw) {
        logger.warn(
          "MONGO_URI had write concern typo 'majori'; using 'majority'. Fix .env to silence this."
        );
    }

    try {
        const connect = await mongoose.connect(MONGO_URI);
        logger.info(`MongoDB connected successfully: ${connect.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB connection failed: ${error}`);
        process.exit(1);
    }
}