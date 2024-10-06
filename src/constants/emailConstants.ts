import { EmailEnum } from "../enums/emailEnum";

export const emailConstants = {
  [EmailEnum.WELCOME]: {
    subject: "Welcome to our platform",
    template: "welcome",
  },
  [EmailEnum.FORGOT_PASSWORD]: {
    subject: "Forgot password",
    template: "forgot-password",
  },
  [EmailEnum.OLD_VISIT]: {
    subject: "Old visit",
    template: "old-visit",
  },
  [EmailEnum.LOGOUT]: {
    subject: "Logout",
    template: "logout",
  },
  [EmailEnum.LOGOUT_ALL]: {
    subject: "Logout all devices",
    template: "logout-all",
  },
  [EmailEnum.VERIFY_EMAIL]: {
    subject: "Verify your email",
    template: "verify-email",
  },
};
