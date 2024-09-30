import fs from "node:fs/promises";
import path from "node:path";

import { IUser } from "../interfaces/user.interface";

const read = async (): Promise<IUser[]> => {
  try {
    const filePath = path.join(process.cwd(), "user.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return fileContent ? JSON.parse(fileContent) : [];
  } catch (e) {
    console.error("Ошибка чтения файла:", e.message);
    throw e;
  }
};

const write = async (users: IUser[]): Promise<void> => {
  try {
    const filePath = path.join(process.cwd(), "user.json");
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
  } catch (e) {
    console.error("Ошибка записи файла:", e.message);
    throw e;
  }
};

export { read, write };
