import express from 'express'
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from './routes/routes.ts'
import { errorHandler } from "./shared/middleware/error.middleware.ts";


const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔗 routes
app.use("/", routes);
app.use(errorHandler)

export default app