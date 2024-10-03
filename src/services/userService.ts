import { ApiError } from "../errors/apiError";
import { ITokenPayload } from "../interfaces/tokenInterface";
import { IUser } from "../interfaces/userInterface";
import { userRepository } from "../repositories/userRepository";

// UserService представляет сервис для работы с пользователями
class UserService {
  // Метод получает список пользователей
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  // Метод получает пользователя по ID
  public async getById(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  public async getMe(jwtPayload: ITokenPayload): Promise<IUser> {
    const user = await userRepository.getById(jwtPayload.userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  // Метод обновляет пользователя по ID
  public async updateMe(jwtPayload: ITokenPayload, dto: IUser): Promise<IUser> {
    return await userRepository.updateById(jwtPayload.userId, dto);
  }

  // Метод удаляет пользователя по ID
  public async deleteMe(jwtPayload: ITokenPayload): Promise<void> {
    // console.log("DeleteMe service triggered with payload:", jwtPayload);
    return await userRepository.deleteById(jwtPayload.userId);
  }
}

export const userService = new UserService();
