import { NextFunction, Request, Response } from "express";

import { ITokenPayload } from "../interfaces/tokenInterface";
import { IRegistration, IUser } from "../interfaces/userInterface";
import { authService } from "../services/authService";

class AuthController {
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Выполняем авторизацию и получаем токен
      const dto = req.body as IUser;
      const token = await authService.login(dto);
      res.status(201).json(token);
    } catch (e) {
      next(e);
    }
  }
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as IRegistration;
      const result = await authService.register(dto);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.res.locals.refreshToken as string;
      const jwtPayload = req.res.locals.payload as ITokenPayload;
      const result = await authService.refresh(token, jwtPayload);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
