import bcrypt from "bcrypt";

class PasswordService {
  // Метод для хеширования пароля
  public async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Метод для сравнения хэшированного пароля с введенным текстом
  public async compare(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
}

export const passwordService = new PasswordService();
