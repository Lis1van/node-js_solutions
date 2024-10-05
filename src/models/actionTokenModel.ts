import { model, Schema } from "mongoose";

import { ActionTokenEnum } from "../enums/actionTokenEnum";
import { IActionToken } from "../interfaces/actionTokenInterface";
import { User } from "./userModel";

const actionTokenSchema = new Schema(
  {
    token: { type: "string", required: true },
    type: { type: "string", required: true, enum: ActionTokenEnum },
    _userId: { type: Schema.Types.ObjectId, required: true, ref: User },
  },
  { timestamps: true, versionKey: false },
);
export const ActionToken = model<IActionToken>(
  "action-token",
  actionTokenSchema,
);
