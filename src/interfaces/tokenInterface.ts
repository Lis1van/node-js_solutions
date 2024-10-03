import { RoleEnum } from "../enums/roleEnum";

/**
 * Интерфейс для токена, представляющий документ в MongoDB
 */
export interface IToken {
  _id?: string; // идентификатор документа в MongoDB, может быть null или undefined
  accessToken: string;
  refreshToken: string;
  _userId: string; // идентификатор пользователя в MongoDB, может быть null или undefined
}

/**
 * Интерфейс для полезной нагрузки токена
 */
export interface ITokenPayload {
  userId: string | null; // идентификатор пользователя
  role: RoleEnum; // роль пользователя
}

/**
 * Интерфейс для пары токенов, используемый для возврата токенов доступа и обновления
 */
export interface ITokenPair {
  accessToken: string; // токен доступа
  refreshToken: string; // токен обновления
}
