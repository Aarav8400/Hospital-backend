import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import fileUpload from "express-fileupload";
const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

//routes import

import messageRouter from "./routes/message.routes.js";

import userRouter from "./routes/user.routes.js";

import appointmentRouter from "./routes/appointment.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

//router declartion
app.use("/api/v1/message", messageRouter);

app.use("/api/v1/user", userRouter);

app.use("/api/v1/appointment", appointmentRouter);

app.use(errorMiddleware);
export default app;
