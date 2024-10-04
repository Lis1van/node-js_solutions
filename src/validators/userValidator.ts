import joi from "joi";

import { regexConstants } from "../constants/regexConstants";

const userFields = {
  name: joi.string().trim().regex(regexConstants.NAME_REGEX),
  age: joi.number().min(15).max(99),
  email: joi.string().lowercase().trim().regex(regexConstants.EMAIL_REGEX),
  password: joi.string().regex(regexConstants.PASSWORD_REGEX),
};

export class UserValidator {
  public static createUserSchema = joi.object({
    ...userFields,
    ...{
      name: userFields.name.required(),
      age: userFields.age.required(),
      email: userFields.email.required(),
      password: userFields.password.required(),
    },
  });

  public static updateUserSchema = joi.object({
    ...userFields,
  });

  public static registerUserSchema = joi.object({
    ...userFields,
    ...{
      email: userFields.email.required(),
      password: userFields.password.required(),
    },
  });
}
