import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
import { ActionTokenEnum } from "../enums/actionTokenEnum";
import { TokenEnum } from "../enums/tokenEnum";
import { ApiError } from "../errors/apiError";
import { ITokenPair, ITokenPayload } from "../interfaces/tokenInterface";

class TokenService {
  public generateToken(payload: ITokenPayload): ITokenPair {
    const accessToken = jsonwebtoken.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRATION,
    });

    const refreshToken = jsonwebtoken.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRATION,
    });
    return { accessToken, refreshToken };
  }
  // public verifyToken(
  //   token: string,
  //   type: TokenEnum,
  // ): ITokenPayload | undefined {
  //   try {
  //     let secret: string;
  //     switch (type) {
  //       case TokenEnum.ACCESS:
  //         secret = config.JWT_ACCESS_SECRET;
  //         break;
  //       case TokenEnum.REFRESH:
  //         secret = config.JWT_REFRESH_SECRET;
  //         break;
  //     }
  //     return jsonwebtoken.verify(token, secret) as ITokenPayload;
  //   } catch (e) {
  //     console.error(e);
  //     throw new ApiError("Invalid token", 401);
  //   }
  // }
  public verifyToken(
    token: string,
    type: TokenEnum | ActionTokenEnum,
  ): ITokenPayload {
    try {
      let secret: string;

      switch (type) {
        case TokenEnum.ACCESS:
          secret = config.JWT_ACCESS_SECRET;
          break;

        case TokenEnum.REFRESH:
          secret = config.JWT_REFRESH_SECRET;
          break;

        case ActionTokenEnum.FORGOT_PASSWORD:
          secret = config.ACTION_FORGOT_PASSWORD_SECRET;
          break;

        case ActionTokenEnum.VERIFY_EMAIL:
          secret = config.ACTION_VERIFY_EMAIL_SECRET;
          break;

        default:
          throw new ApiError("Invalid token type", 400);
      }

      return jsonwebtoken.verify(token, secret) as ITokenPayload;
    } catch (e) {
      console.error(e.message);
      throw new ApiError("Invalid token", 401);
    }
  }

  public generateActionToken(
    payload: ITokenPayload,
    tokenType: ActionTokenEnum,
  ): string {
    let secret: string;
    let expiresIn: string;
    switch (tokenType) {
      case ActionTokenEnum.FORGOT_PASSWORD:
        secret = config.ACTION_FORGOT_PASSWORD_SECRET;
        expiresIn = config.ACTION_FORGOT_PASSWORD_EXPIRATION;
        break;
      case ActionTokenEnum.VERIFY_EMAIL:
        secret = config.ACTION_VERIFY_EMAIL_SECRET;
        expiresIn = config.ACTION_VERIFY_EMAIL_EXPIRATION;
        break;
      default:
        throw new ApiError("Invalid action token type", 400);
    }
    return jsonwebtoken.sign(payload, secret, { expiresIn });
  }

  // public verifyAccessToken(
  //   token: string,
  //   type: ActionTokenEnum,
  // ): ITokenPayload | undefined {
  //   try {
  //     let secret: string;
  //     switch (type) {
  //       case ActionTokenEnum.FORGOT_PASSWORD:
  //         secret = config.ACTION_FORGOT_PASSWORD_SECRET;
  //         break;
  //       default:
  //         throw new ApiError("Invalid action token type", 400);
  //     }
  //     return jsonwebtoken.verify(token, secret) as ITokenPayload;
  //   } catch (e) {
  //     console.error(e);
  //     throw new ApiError("Invalid token", 401);
  //   }
  // }
}

export const tokenService = new TokenService();
