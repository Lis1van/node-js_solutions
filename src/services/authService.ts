import { EmailEnum } from "../enums/emailEnum";
import { ApiError } from "../errors/apiError";
import { ITokenPair, ITokenPayload } from "../interfaces/tokenInterface";
import { IRegistration, IUser } from "../interfaces/userInterface";
import { tokenRepository } from "../repositories/tokenRepository";
import { userRepository } from "../repositories/userRepository";
import { emailService } from "./emailService";
import { passwordService } from "./passwordService";
import { tokenService } from "./tokenService";

class AuthService {
  public async login(
    dto: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    await this.isEmailExistOrThrow(dto.email);

    const password = await passwordService.hash(dto.password);

    const user = await userRepository.create({ ...dto, password });

    const tokens = tokenService.generateToken({
      userId: user._id,
      role: user.role,
    });

    await tokenRepository.generateToken({ ...tokens, _userId: user._id });
    await emailService.sendMail(EmailEnum.WELCOME, "gameinoriginal@gmail.com", {
      name: user.name,
    });
    return { user, tokens };
  }

  public async register(
    dto: IRegistration,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    const user = await userRepository.getByEmail(dto.email);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const isPasswordValid = await passwordService.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ApiError("Invalid password", 401);
    }

    const tokens = tokenService.generateToken({
      userId: user._id,
      role: user.role,
    });

    await tokenRepository.generateToken({ ...tokens, _userId: user._id });

    return { user, tokens };
  }

  public async refresh(
    refreshToken: string,
    payload: ITokenPayload,
  ): Promise<ITokenPair> {
    await tokenRepository.deleteByParams({ refreshToken });

    const tokens = tokenService.generateToken({
      userId: payload.userId,
      role: payload.role,
    });

    await tokenRepository.generateToken({ ...tokens, _userId: payload.userId });

    return tokens;
  }

  public async logout(
    jwtPayload: ITokenPayload,
    tokenId: string,
  ): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);
    await tokenRepository.deleteByParams({ _id: tokenId });
    await emailService.sendMail(EmailEnum.LOGOUT, "gameinoriginal@gmail.com", {
      name: user.name,
    });
  }

  public async logoutAll(jwtPayload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);
    await tokenRepository.deleteManyByParams({ _userId: jwtPayload.userId });
    await emailService.sendMail(
      EmailEnum.LOGOUT_ALL,
      "gameinoriginal@gmail.com",
      {
        name: user.name,
      },
    );
  }

  private async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);
    if (user) {
      throw new ApiError("Email already exists", 409);
    }
  }
}
export const authService = new AuthService();
