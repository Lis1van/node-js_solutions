import { Router } from "express";

import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { commonMiddleware } from "../middlewares/commonMiddleware";
import { UserValidator } from "../validators/userValidator";

const userRouter = Router();

userRouter.get("/", userController.getList);

userRouter.get("/me", authMiddleware.checkAccessToken, userController.getMe);

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

userRouter.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.getById,
);

export { userRouter };
