import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days later

      return `[${timestamp}] ${level.toUpperCase()} | expires: ${expiry.toISOString()} | ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

export default logger