import { ActionTokenEnum } from "../enums/actionTokenEnum";
import { EmailEnum } from "../enums/emailEnum";
import { ApiError } from "../errors/apiError";
import { ITokenPair, ITokenPayload } from "../interfaces/tokenInterface";
import {
  IUser,
  PasswordEmail,
  PasswordReset,
  UserRegistration,
} from "../interfaces/userInterface";
import { actionTokenRepository } from "../repositories/actionTokenRepository";
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

    const token = await tokenService.generateActionToken(
      { userId: user._id, role: user.role },
      ActionTokenEnum.VERIFY_EMAIL,
    );
    await actionTokenRepository.create({
      token,
      type: ActionTokenEnum.VERIFY_EMAIL,
      _userId: user._id,
    });

    await tokenRepository.generateToken({ ...tokens, _userId: user._id });
    await emailService.sendMail(EmailEnum.WELCOME, user.email, {
      name: user.name,
      actionToken: token,
    });
    return { user, tokens };
  }

  public async register(
    dto: UserRegistration,
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

    // Генерируем токен для верификации
    const verificationToken = await tokenService.generateActionToken(
      { userId: user._id, role: user.role },
      ActionTokenEnum.VERIFY_EMAIL,
    );

    await actionTokenRepository.create({
      token: verificationToken,
      type: ActionTokenEnum.VERIFY_EMAIL,
      _userId: user._id,
    });

    // Отправляем email с токеном для верификации
    await emailService.sendMail(EmailEnum.VERIFY_EMAIL, user.email, {
      name: user.name,
      actionToken: verificationToken,
    });

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
    await emailService.sendMail(EmailEnum.LOGOUT, user.email, {
      name: user.name,
    });
  }

  public async logoutAll(jwtPayload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);
    await tokenRepository.deleteManyByParams({ _userId: jwtPayload.userId });
    await emailService.sendMail(EmailEnum.LOGOUT_ALL, user.email, {
      name: user.name,
    });
  }

  public async forgotPasswordEmail(dto: PasswordEmail): Promise<void> {
    const user = await userRepository.getByEmail(dto.email);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const token = await tokenService.generateActionToken(
      { userId: user._id, role: user.role },
      ActionTokenEnum.FORGOT_PASSWORD,
    );
    await actionTokenRepository.create({
      token,
      type: ActionTokenEnum.FORGOT_PASSWORD,
      _userId: user._id,
    });

    await emailService.sendMail(EmailEnum.FORGOT_PASSWORD, user.email, {
      name: user.name,
      email: user.email,
      actionToken: token,
    });
  }

  public async forgotPasswordReset(
    dto: PasswordReset,
    jwtPayload: ITokenPayload,
  ): Promise<void> {
    const password = await passwordService.hash(dto.password);
    await userRepository.updateById(jwtPayload.userId, { password });
    await actionTokenRepository.deleteManyByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenEnum.FORGOT_PASSWORD,
    });
    await tokenRepository.deleteManyByParams({ _userId: jwtPayload.userId });
  }

  public async verifyEmail(jwtPayload: ITokenPayload): Promise<void> {
    await userRepository.updateById(jwtPayload.userId, { isVerified: true });
    await actionTokenRepository.deleteManyByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenEnum.VERIFY_EMAIL,
    });
  }

  private async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);
    if (user) {
      throw new ApiError("Email already exists", 409);
    }
  }
}
export const authService = new AuthService();
