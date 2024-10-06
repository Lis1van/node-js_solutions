// Импортируем необходимые типы и модели из других модулей
import { FilterQuery } from "mongoose"; // Импорт типа FilterQuery для использования в запросах к базе данных

import { IOldPassword } from "../interfaces/oldPasswordInterface"; // Импорт интерфейса IOldPassword
import { OldPassword } from "../models/oldPasswordModel"; // Импорт модели OldPassword для работы с коллекцией в MongoDB

// Создаем класс OldPasswordRepository для управления операциями с прошлыми паролями
class OldPasswordRepository {
  // Метод для создания нового документа с прошедшим паролем
  public async create(dto: IOldPassword): Promise<IOldPassword> {
    // Используем метод create библиотеки Mongoose для добавления нового документа в коллекцию
    return await OldPassword.create(dto);
  }

  // Метод для поиска документов по идентификатору пользователя
  public async findByParams(userId: string): Promise<IOldPassword[]> {
    // Выполняем поиск в коллекции OldPassword по полю _userId
    return await OldPassword.find({ _userId: userId });
  }

  // Метод для удаления документов, соответствующих заданным параметрам
  public async deleteByParams(
    params: FilterQuery<IOldPassword>, // Принимаем параметры типа FilterQuery для фильтрации документов
  ): Promise<number> {
    // Удаляем все документы, соответствующие указанным параметрам, с помощью метода deleteMany
    const { deletedCount } = await OldPassword.deleteMany(params);
    return deletedCount;
  }
}

// Экспортируем экземпляр класса OldPasswordRepository для использования в других частях приложения
export const oldPasswordRepository = new OldPasswordRepository();
