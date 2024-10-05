import { NextFunction, Request, Response } from "express";

import { ActionTokenEnum } from "../enums/actionTokenEnum";
import { TokenEnum } from "../enums/tokenEnum";
import { ApiError } from "../errors/apiError";
import { actionTokenRepository } from "../repositories/actionTokenRepository";
import { tokenRepository } from "../repositories/tokenRepository";
import { tokenService } from "../services/tokenService";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      console.log("Auth middleware triggered");
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError("Token is not provided", 401);
      }
      const accessToken = header.split("Bearer ")[1];
      const payload = tokenService.verifyToken(accessToken, TokenEnum.ACCESS);

      const pair = await tokenRepository.findByParams({ accessToken });
      if (!pair) {
        throw new ApiError("Token is not valid", 401);
      }
      req.res.locals.tokenId = pair._id;
      req.res.locals.jwtPayload = payload;
      console.log("Passing request to next middleware/controller");
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError("Token is not provided", 401);
      }
      const refreshToken = header.split("Bearer ")[1];
      const payload = tokenService.verifyToken(refreshToken, TokenEnum.REFRESH);

      const pair = await tokenRepository.findByParams({ refreshToken });
      if (!pair) {
        throw new ApiError("Token is not valid", 401);
      }
      req.res.locals.payload = payload;
      req.res.locals.refreshToken = refreshToken;
      next();
    } catch (e) {
      next(e);
    }
  }

  // public async checkActionToken(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) {
  //   try {
  //     const token = req.body.token as string;
  //     if (!token) {
  //       throw new ApiError("Token is not provided", 401);
  //     }
  //     const payload = tokenService.verifyToken(
  //       token,
  //       type,
  //     );
  //
  //     const tokenEntity = await actionTokenRepository.getByToken(token);
  //     if (!tokenEntity) {
  //       throw new ApiError("Token is not valid", 401);
  //     }
  //     req.res.locals.jwtPayload = payload;
  //     next();
  //   } catch (e) {
  //     next(e);
  //   }
  // }
  public checkActionToken(type: ActionTokenEnum) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.body.token as string;
        if (!token) {
          throw new ApiError("Token is not provided", 401);
        }
        const payload = tokenService.verifyToken(token, type);

        const tokenEntity = await actionTokenRepository.getByToken(token);
        if (!tokenEntity) {
          throw new ApiError("Token is not valid", 401);
        }
        req.res.locals.jwtPayload = payload;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
