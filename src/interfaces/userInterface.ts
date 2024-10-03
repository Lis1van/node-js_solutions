import { RoleEnum } from "../enums/roleEnum";

/**
 * Интерфейс для пользователя, представляющий документ в MongoDB
 */
export interface IUser {
  _id?: string; // идентификатор документа в MongoDB, может быть null или undefined
  name: string;
  email: string;
  password: string;
  age: number;
  role: RoleEnum;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt?: Date; // дата создания пользователя, может быть null или undefined
  updatedAt?: Date; // дата последнего обновления пользователя, может быть null или undefined
}

/**
 * Тип для представления информации о регистрации пользователя
 */
export type IRegistration = Pick<IUser, "email" | "password">;
