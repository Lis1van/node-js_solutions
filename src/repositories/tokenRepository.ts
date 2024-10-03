import { IToken } from "../interfaces/tokenInterface";
import { Token } from "../models/tokenModel";

class TokenRepository {
  public async generateToken(dto: Partial<IToken>): Promise<IToken> {
    return await Token.create(dto);
  }
  public async findByParams(param: Partial<IToken>): Promise<IToken | null> {
    return await Token.findOne(param);
  }

  public async deleteByParams(params: Partial<IToken>): Promise<void> {
    await Token.deleteOne(params);
  }
}

export const tokenRepository = new TokenRepository();
