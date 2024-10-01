import { Router } from "express";

import { userController } from "../controllers/userController";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { UserValidator } from "../validators/userValidator";

// Создание экземпляра маршрутизатора
const userRouter = Router();

// GET /users - Получение списка пользователей
userRouter.get("/", userController.getList);

// POST /users - Создание нового пользователя
userRouter.post(
  "/",
  commonMiddleware.isBodyValid(UserValidator.createUserSchema),
  userController.create,
);

// GET /users/:userId - Получение пользователя по ID
userRouter.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.getById,
);

// PUT /users/:userId - Обновление пользователя по ID
userRouter.put(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isBodyValid(UserValidator.updateUserSchema),
  userController.updateById,
);

// DELETE /users/:userId - Удаление пользователя по ID
userRouter.delete(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.deleteById,
);

// Экспорт маршрутизатора пользователей
export { userRouter };
