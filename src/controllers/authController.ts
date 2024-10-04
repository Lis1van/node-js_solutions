import { NextFunction, Request, Response } from "express";

import { ITokenPayload } from "../interfaces/tokenInterface";
import { IRegistration, IUser } from "../interfaces/userInterface";
import { authService } from "../services/authService";

class AuthController {
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
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

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenId = req.res.locals.tokenId as string;
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      await authService.logout(jwtPayload, tokenId);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      await authService.logoutAll(jwtPayload);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
