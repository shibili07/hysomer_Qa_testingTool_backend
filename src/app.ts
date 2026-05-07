import express from 'express'
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from './routes/routes.ts'
import { errorHandler } from "./shared/middleware/error.middleware.ts";

/** Local dev + comma-separated `FRONTEND_ORIGINS` (e.g. Vercel URL) for production. */
function corsAllowedOrigins(): Set<string> {
  const set = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://hysomer-qa-testing-tool-frontend.vercel.app",
  ]);
  const fromEnv = process.env.FRONTEND_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];
  for (const o of fromEnv) set.add(o);
  return set;
}

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = corsAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔗 routes
app.use("/", routes);
app.use(errorHandler)

export default app