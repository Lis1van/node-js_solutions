const fs = require('node:fs/promises')
const path = require('node:path')

module.exports = {
    read: async () => {
        try {
            const filePath = path.join(__dirname, 'user.json');
            const fileContent = await fs.readFile(filePath, 'utf-8');
            return fileContent ? JSON.parse(fileContent) : [];
        } catch (e) {
            console.error('Ошибка чтения файла:', e.message);
            throw e;
        }
    },
    write: async (users) => {
        try {
            const filePath = path.join(__dirname, 'user.json');
            await fs.writeFile(filePath, JSON.stringify(users, null, 2));
        } catch (e) {
            console.error('Ошибка записи файла:', e.message);
            throw e;
        }
    }
}
