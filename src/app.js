import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import fileUpload from "express-fileupload";
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dashboard-ecru-three.vercel.app",
      "https://hospital-frontend-two.vercel.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
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
