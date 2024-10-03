import * as jsonwebtoken from "jsonwebtoken";

import { config } from "../configs/config";
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
  public verifyAccessToken(
    token: string,
    type: TokenEnum,
  ): ITokenPayload | undefined {
    try {
      let secret: string;
      switch (type) {
        case TokenEnum.ACCESS:
          secret = config.JWT_ACCESS_SECRET;
          break;
        case TokenEnum.REFRESH:
          secret = config.JWT_REFRESH_SECRET;
          break;
      }
      return jsonwebtoken.verify(token, secret) as ITokenPayload;
    } catch (e) {
      console.error(e);
      throw new ApiError("Invalid token", 401);
    }
  }
}

export const tokenService = new TokenService();
