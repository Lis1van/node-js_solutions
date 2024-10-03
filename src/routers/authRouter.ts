import { Router } from "express";

import { authController } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { UserValidator } from "../validators/userValidator";

// Создание экземпляра маршрутизатора для авторизации
const authRouter = Router();

// POST /login - Авторизация пользователя с использованием логина и пароля
authRouter.post(
  "/login",
  commonMiddleware.isBodyValid(UserValidator.createUserSchema),
  authController.login,
);

// POST /register - Регистрация нового пользователя
// Заметка: Валидация тела запроса отключена для простоты демонстрации
authRouter.post(
  "/register",
  // commonMiddleware.isBodyValid(UserValidator.createUserSchema),
  authController.register,
);

// POST /refresh - Обновление токенов доступа с использованием refresh токена
authRouter.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

// Экспорт маршрутизатора для авторизации
export { authRouter };
