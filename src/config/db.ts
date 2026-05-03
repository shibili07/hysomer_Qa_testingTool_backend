import mongoose  from 'mongoose'
import logger from '../shared/utils/logger.ts'

export const connectDB = async (): Promise<void> => {
    const MONGO_URI = process.env.MONGO_URI;
    console.log(MONGO_URI);
    if (!MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }

    try {
        const connect = await mongoose.connect(MONGO_URI)
        logger.info(`MongoDB connected  succefully: ${connect.connection.host}`)
    } catch (error) {
        logger.error(`MongoDB connection failed: ${error}`);
        process.exit(1);
    }
}