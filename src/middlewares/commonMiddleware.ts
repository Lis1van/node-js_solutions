import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/apiError";

// CommonMiddleware представляет общие промежуточные слои для вашего приложения
class CommonMiddleware {
  // Метод проверяет, является ли идентификатор действительным ObjectId или HexString
  public isIdValid(key: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!isObjectIdOrHexString(req.params[key])) {
          throw new ApiError("Invalid id", 400);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  // Метод проверяет, является ли тело запроса действительным в соответствии с указанной схемой
  public isBodyValid(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await validator.validateAsync(req.body);
        next();
      } catch (e) {
        next(new ApiError(e.details[0].message, 400));
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
