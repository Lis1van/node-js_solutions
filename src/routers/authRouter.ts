import { Router } from "express";

import { authController } from "../controllers/authController";
import { ActionTokenEnum } from "../enums/actionTokenEnum";
import { authMiddleware } from "../middlewares/authMiddleware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { UserValidator } from "../validators/userValidator";

const authRouter = Router();

authRouter.post(
  "/login",
  commonMiddleware.isBodyValid(UserValidator.createUserSchema),
  authController.login,
);

authRouter.post(
  "/register",
  commonMiddleware.isBodyValid(UserValidator.registerUserSchema),
  authController.register,
);

authRouter.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

authRouter.post(
  "/logout",
  authMiddleware.checkAccessToken,
  authController.logout,
);

authRouter.post(
  "/logout/all",
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);

authRouter.post("/forgot-password", authController.forgotPasswordEmail);

authRouter.put(
  "/forgot-password",
  authMiddleware.checkActionToken(ActionTokenEnum.FORGOT_PASSWORD),
  authController.forgotPasswordReset,
);

authRouter.post(
  "/verify",
  authMiddleware.checkActionToken(ActionTokenEnum.VERIFY_EMAIL),
  authController.verifyEmail,
);

export { authRouter };
