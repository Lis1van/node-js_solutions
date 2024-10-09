import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import * as mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";

import swaggerDocument from "../docs/swagger.json";
import { config } from "./configs/config";
import { cronRunner } from "./crons";
import { ApiError } from "./errors/apiError";
import { authRouter } from "./routers/authRouter";
import { userRouter } from "./routers/userRouter";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "Origin",
      "Access-Control-Allow-Origin",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use(
  "*",
  (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    const status = error instanceof ApiError ? error.status : 500;
    res.status(status).send({
      error: {
        code: status,
        message: error.message,
      },
    });
  },
);

process.on("uncaughtException", (err) => {
  console.error("uncaughtException", err.message, err.stack);
  process.exit(1);
});

app.listen(config.port, async () => {
  await mongoose.connect(config.MONGOOSE_URI);
  cronRunner();
  console.log(`Server is running on http://${config.host}:${config.port}`);
});
