import { model, Schema } from "mongoose";

import { IToken } from "../interfaces/tokenInterface";
import { User } from "./userModel";

const tokenSchema = new Schema(
  {
    accessToken: { type: "string", required: true },
    refreshToken: { type: "string", required: true },
    _userId: { type: Schema.Types.ObjectId, required: true, ref: User },
  },
  { timestamps: true, versionKey: false },
);
export const Token = model<IToken>("tokens", tokenSchema);
