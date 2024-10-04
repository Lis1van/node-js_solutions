import { EmailEnum } from "../enums/emailEnum";
import { PersonalEmailData } from "./PersonalEmailData";
import { SelectPropertiesType } from "./SelectPropertiesType";

export type EmailTemplateData = {
  [EmailEnum.WELCOME]: SelectPropertiesType<PersonalEmailData, "name">;

  [EmailEnum.FORGOT_PASSWORD]: SelectPropertiesType<
    PersonalEmailData,
    "name" | "email"
  >;

  [EmailEnum.OLD_VISIT]: SelectPropertiesType<PersonalEmailData, "email">;
  [EmailEnum.LOGOUT]: SelectPropertiesType<PersonalEmailData, "name">;
  [EmailEnum.LOGOUT_ALL]: SelectPropertiesType<PersonalEmailData, "name">;
};
