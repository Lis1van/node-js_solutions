import { RoleEnum } from "../enums/roleEnum";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  age: number;
  role: RoleEnum;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
