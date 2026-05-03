import "./config/env.ts"; 
import app from "./app.ts";
import { connectDB } from "./config/db.ts";
import logger from "./shared/utils/logger.ts";

const PORT: number = Number(process.env.PORT) 

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(` Server running on port ${PORT}`);
    });

  } catch (error: unknown) {
    logger.error(" Failed to start server", error);
    process.exit(1);
  }
};

startServer();