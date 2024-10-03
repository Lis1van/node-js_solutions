import { Router } from "express";

import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { UserValidator } from "../validators/userValidator";

// Создание экземпляра маршрутизатора
const userRouter = Router();

// GET /users - Получение списка пользователей
userRouter.get("/", userController.getList);

// GET /users/:userId - Получение пользователя по ID
userRouter.get("/me", authMiddleware.checkAccessToken, userController.getMe);

// PUT /users/:userId - Обновление пользователя по ID
userRouter.put(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(UserValidator.updateUserSchema),
  userController.updateMe,
);

// DELETE /users/:userId - Удаление пользователя по ID
userRouter.delete(
  "/me",
  authMiddleware.checkAccessToken,
  // commonMiddleware.isIdValid("userId"),
  userController.deleteMe,
);

// GET /users/:userId - Получение пользователя по ID
userRouter.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.getById,
);

// Экспорт маршрутизатора пользователей
export { userRouter };
