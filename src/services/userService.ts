import { ApiError } from "../errors/apiError";
import { IUser } from "../interfaces/userInterface";
import { userRepository } from "../repositories/userRepository";

// UserService представляет сервис для работы с пользователями
class UserService {
  // Метод получает список пользователей
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  // Метод создает нового пользователя
  public async create(dto: Partial<IUser>): Promise<IUser> {
    await this.isEmailExist(dto.email);
    return await userRepository.create(dto);
  }

  // Метод получает пользователя по ID
  public async getById(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  // Метод обновляет пользователя по ID
  public async updateById(userId: string, dto: IUser): Promise<IUser> {
    return await userRepository.updateById(userId, dto);
  }

  // Метод удаляет пользователя по ID
  public async deleteById(userId: string): Promise<void> {
    return await userRepository.deleteById(userId);
  }

  // Приватный метод проверяет, существует ли уже пользователь с указанной электронной почтой
  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);
    if (user) {
      throw new ApiError("Email already exists", 409);
    }
  }
}

export const userService = new UserService();
