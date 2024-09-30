import express, { NextFunction, Request, Response } from "express";

import { ApiError } from "./errors/apiError";
import { userRouter } from "./routers/userRouter";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

// Обработка ошибок
app.use(
  "*",
  (error: ApiError, _req: Request, res: Response, _next: NextFunction) => {
    const status = error instanceof ApiError ? error.status : 500;
    res.status(status).send({ error: error.message });
  },
);

process.on("uncaughtException", (err) => {
  console.error("uncaughtException", err.message, err.stack);
  process.exit(1);
});

app.listen(3000, () => {
  console.log("Сервер запущен на http://localhost:3000");
});
