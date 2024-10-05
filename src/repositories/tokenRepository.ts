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

  public async deleteManyByParams(params: Partial<IToken>): Promise<void> {
    await Token.deleteMany(params);
  }

  public async deleteManyByDate(date: Date): Promise<number> {
    const { deletedCount } = await Token.deleteMany({
      createdAt: { $lt: date },
    });
    return deletedCount;
  }
}

export const tokenRepository = new TokenRepository();
