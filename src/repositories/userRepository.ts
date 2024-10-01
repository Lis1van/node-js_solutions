import { IUser } from "../interfaces/userInterface";
import { User } from "../models/userModel";

class UserRepository {
  // Метод получения списка пользователей
  public async getList(): Promise<IUser[]> {
    return await User.find({});
  }

  // Метод создания нового пользователя
  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await User.create(dto);
  }

  // Метод получения пользователя по идентификатору
  public async getById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  // Метод получения пользователя по идентификатору
  public async getByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  // Метод обновления пользователя по идентификатору
  public async updateById(userId: string, dto: IUser): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, { new: true });
  }

  // Метод удаления пользователя по идентификатору
  public async deleteById(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }
}

export const userRepository = new UserRepository();
