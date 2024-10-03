import dotenv from "dotenv";

// Загрузка переменных окружения из файла .env
dotenv.config();

/**
 * Объект конфигурации, содержащий настройки приложения
 */
export const config = {
  // Порт, на котором запущено приложение
  // Если переменная окружения PORT не определена, используется значение по умолчанию 3003
  port: parseInt(process.env.PORT) || 3003,

  // Хост, на котором запущено приложение
  // Значение берется из переменной окружения HOST
  host: process.env.HOST,

  // Строка подключения к MongoDB
  // Значение берется из переменной окружения MONGOOSE_URI
  mongoose: process.env.MONGOOSE_URI,

  // Секретный ключ для создания токенов доступа
  // Значение берется из переменной окружения JWT_ACCESS_SECRET
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,

  // Время жизни токенов доступа
  // Значение берется из переменной окружения JWT_ACCESS_EXPIRATION
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION,

  // Секретный ключ для создания токенов обновления
  // Значение берется из переменной окружения JWT_REFRESH_SECRET
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  // Время жизни токенов обновления
  // Значение берется из переменной окружения JWT_REFRESH_EXPIRATION
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
};
