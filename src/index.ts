import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { config } from "./configs/config";
import { ApiError } from "./errors/apiError";
import { authRouter } from "./routers/authRouter";
import { userRouter } from "./routers/userRouter";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  console.log(`Server is running on http://${config.host}:${config.port}`);
});
