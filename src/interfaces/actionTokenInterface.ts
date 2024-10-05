import { ActionTokenEnum } from "../enums/actionTokenEnum";

export interface IActionToken {
  _id?: string;
  token: string;
  type: ActionTokenEnum;
  _userId: string;
}
