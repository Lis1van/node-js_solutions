import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import { avatarConfig } from "../constants/imageConstants";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { fileMiddleware } from "../middlewares/fileMiddleware";
import { UserValidator } from "../validators/userValidator";

const userRouter = Router();

userRouter.get(
  "/",
  commonMiddleware.isQueryValid(UserValidator.listQuery),
  userController.getList,
);

userRouter.get(
  "/me",
  rateLimit({ windowMs: 2 * 60 * 1000, limit: 4 }),
  authMiddleware.checkAccessToken,
  userController.getMe,
);

userRouter.put(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(UserValidator.updateUserSchema),
  userController.updateMe,
);

userRouter.delete(
  "/me",
  authMiddleware.checkAccessToken,
  // commonMiddleware.isIdValid("userId"),
  userController.deleteMe,
);

userRouter.post(
  "/me/avatar",
  authMiddleware.checkAccessToken,
  fileMiddleware.isFileValid("avatar", avatarConfig),
  userController.uploadAvatar,
);

userRouter.delete(
  "/me/avatar",
  authMiddleware.checkAccessToken,
  userController.deleteAvatar,
);

userRouter.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.getById,
);

export { userRouter };
