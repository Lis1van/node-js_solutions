import { model, Schema } from "mongoose";

import { IOldPassword } from "../interfaces/oldPasswordInterface";
import { User } from "./userModel";

const oldPasswordSchema = new Schema(
  {
    password: { type: String, required: true },
    _userId: { type: Schema.Types.ObjectId, required: true, ref: User },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const OldPassword = model<IOldPassword>(
  "old-password",
  oldPasswordSchema,
);
