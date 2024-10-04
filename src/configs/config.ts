import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT) || 3003,
  host: process.env.HOST,
  FRONT_URL: process.env.FRONT_URL,
  MONGOOSE_URI: process.env.MONGOOSE_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
};
