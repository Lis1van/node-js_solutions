import { RoleEnum } from "../enums/roleEnum";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  age: number;
  role: RoleEnum;
  avatar?: string;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRegistration = Pick<IUser, "email" | "password">;
export type PasswordEmail = Pick<IUser, "email">;
export type PasswordReset = Pick<IUser, "password"> & { token: string };
export type PasswordChange = Pick<IUser, "password"> & { oldPassword: string };
