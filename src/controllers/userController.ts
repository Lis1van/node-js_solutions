import { NextFunction, Request, Response } from "express";

import { ITokenPayload } from "../interfaces/tokenInterface";
import { IUser } from "../interfaces/userInterface";
import { userService } from "../services/userService";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getList();
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await userService.getById(userId);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const result = await userService.getMe(jwtPayload);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const dto = req.body as IUser;
      const result = await userService.updateMe(jwtPayload, dto);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      await userService.deleteMe(jwtPayload);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
