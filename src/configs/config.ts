import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Порт, на котором запущено приложение
  port: parseInt(process.env.PORT) || 3003,

  // Хост, на котором запущено приложение
  host: process.env.HOST,

  // Строка подключения к MongoDB
  mongoose: process.env.MONGOOSE_URI,
};
