import { OrderEnum } from "../enums/orderEnum";
import { RoleEnum } from "../enums/roleEnum";
import { UserListOrderEnum } from "../enums/userListOrderEnum";

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

export interface IUserListQuery {
  limit?: number;
  page?: number;
  search?: string;
  order?: OrderEnum;
  orderBy?: UserListOrderEnum;
}

export type IUserResponse = Pick<
  IUser,
  | "_id"
  | "name"
  | "email"
  | "age"
  | "role"
  | "avatar"
  | "isDeleted"
  | "isVerified"
>;

export interface IUserListResponse {
  data: IUserResponse[];
  total: number;
}
