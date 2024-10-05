import { model, Schema } from "mongoose";

import { RoleEnum } from "../enums/roleEnum";
import { IUser } from "../interfaces/userInterface";

const userSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, default: RoleEnum.USER, enum: RoleEnum },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("users", userSchema);
