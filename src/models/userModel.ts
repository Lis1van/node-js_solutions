import { model, Schema } from "mongoose";

import { RoleEnum } from "../enums/roleEnum";
import { IUser } from "../interfaces/userInterface";

// Схема описывает структуру пользователей
const userSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3 }, // Имя пользователя
    age: { type: Number, required: true }, // Возраст пользователя
    email: { type: String, required: true, unique: true }, // Электронная почта пользователя
    password: { type: String, required: true, minlength: 8 }, // Пароль пользователя
    role: { type: String, default: RoleEnum.USER, enum: RoleEnum }, // Роль пользователя
    isVerified: { type: Boolean, required: false }, // Флаг, указывающий, подтвержден ли пользователь
    isDeleted: { type: Boolean, required: false }, // Флаг, указывающий, удален ли пользователь
  },
  {
    timestamps: true, // Автоматически добавлять поля createdAt и updatedAt каждому документу
    versionKey: false, // Отключить поле _v
  },
);

export const User = model<IUser>("users", userSchema);
