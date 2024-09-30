const fs = require('node:fs/promises'); // Импортируем модуль fs для работы с файловой системой
const path = require('node:path'); // Импортируем модуль path для работы с путями файлов

module.exports = {
    // Функция для чтения данных пользователей из файла
    read: async () => {
        try {
            const filePath = path.join(__dirname, 'user.json'); // Формируем полный путь к файлу user.json
            const fileContent = await fs.readFile(filePath, 'utf-8'); // Читаем содержимое файла в кодировке UTF-8
            return fileContent ? JSON.parse(fileContent) : []; // Если файл не пустой, парсим его содержимое в объект, иначе возвращаем пустой массив
        } catch (e) {
            console.error('Ошибка чтения файла:', e.message); // Выводим сообщение об ошибке в консоль
            throw e; // Пробрасываем ошибку дальше для обработки в вызывающем коде
        }
    },

    // Функция для записи данных пользователей в файл
    write: async (users) => {
        try {
            const filePath = path.join(__dirname, 'user.json'); // Формируем полный путь к файлу user.json
            await fs.writeFile(filePath, JSON.stringify(users, null, 2)); // Записываем массив пользователей в файл в формате JSON с отступами для читаемости
        } catch (e) {
            console.error('Ошибка записи файла:', e.message); // Выводим сообщение об ошибке в консоль
            throw e; // Пробрасываем ошибку дальше для обработки в вызывающем коде
        }
    }
}
