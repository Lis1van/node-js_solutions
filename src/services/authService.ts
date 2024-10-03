import { ApiError } from "../errors/apiError";
import { ITokenPair, ITokenPayload } from "../interfaces/tokenInterface";
import { IRegistration, IUser } from "../interfaces/userInterface";
import { tokenRepository } from "../repositories/tokenRepository";
import { userRepository } from "../repositories/userRepository";
import { passwordService } from "./passwordService";
import { tokenService } from "./tokenService";

class AuthService {
  // Метод для обработки входа пользователя
  public async login(
    dto: Partial<IUser>,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    // Проверка, существует ли пользователь с указанным email
    await this.isEmailExistOrThrow(dto.email);

    // Генерация хэша пароля
    const password = await passwordService.hash(dto.password);

    // Создание нового пользователя
    const user = await userRepository.create({ ...dto, password });

    // Генерация токенов доступа и обновления
    const tokens = tokenService.generateToken({
      userId: user._id,
      role: user.role,
    });

    // Сохранение токенов в базе данных
    await tokenRepository.generateToken({ ...tokens, _userId: user._id });

    // Возврат созданного пользователя и токенов
    return { user, tokens };
  }

  // Метод для обработки регистрации пользователя
  public async register(
    dto: IRegistration,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    // Получение пользователя по email
    const user = await userRepository.getByEmail(dto.email);

    // Проверка, существует ли пользователь
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    // Проверка валидности пароля
    const isPasswordValid = await passwordService.compare(
      dto.password,
      user.password,
    );

    // Проверка, является ли пароль действительным
    if (!isPasswordValid) {
      throw new ApiError("Invalid password", 401);
    }

    // Генерация токенов доступа и обновления
    const tokens = tokenService.generateToken({
      userId: user._id,
      role: user.role,
    });

    // Сохранение токенов в базе данных
    await tokenRepository.generateToken({ ...tokens, _userId: user._id });

    // Возврат созданного пользователя и токенов
    return { user, tokens };
  }

  // Метод для обработки обновления токенов доступа
  public async refresh(
    refreshToken: string,
    payload: ITokenPayload,
  ): Promise<ITokenPair> {
    // Удаление старого токена обновления из базы данных
    await tokenRepository.deleteByParams({ refreshToken });

    // Генерация новых токенов доступа и обновления
    const tokens = tokenService.generateToken({
      userId: payload.userId,
      role: payload.role,
    });

    // Сохранение токенов в базе данных
    await tokenRepository.generateToken({ ...tokens, _userId: payload.userId });

    // Возврат новых токенов
    return tokens;
  }

  // Приватный метод для проверки, существует ли пользователь с указанным email
  private async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);
    if (user) {
      throw new ApiError("Email already exists", 409);
    }
  }
}
export const authService = new AuthService();
