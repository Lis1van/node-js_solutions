const express = require('express'); // Импортируем библиотеку Express для создания веб-приложений
const { read, write } = require('./userStorage'); // Импортируем функции для чтения и записи пользователей из файла

const app = express(); // Создаем экземпляр приложения Express

app.use(express.json()); // Подключаем middleware для парсинга JSON-данных в теле запросов
app.use(express.urlencoded({ extended: true })); // Подключаем middleware для парсинга URL-кодированных данных

// Функция для проверки данных пользователя
const validateUserData = (name, email, password) => {
    // Проверяем, что имя задано и его длина не менее 3 символов
    if (!name || name.length < 3) {
        return 'Имя обязательно и должно быть не менее 3 символов';
    }
    // Проверяем, что email задан и содержит символ '@'
    if (!email || !email.includes('@')) {
        return 'Email обязателен и должен быть действительным';
    }
    // Проверяем, что пароль задан и его длина не менее 6 символов
    if (!password || password.length < 6) {
        return 'Пароль обязателен и должен быть не менее 6 символов';
    }
    return null; // Если все проверки пройдены, возвращаем null
};

// Функция для получения пользователя по ID
const getUserById = async (userId) => {
    const users = await read(); // Читаем всех пользователей из файла
    return users.find(user => user.id === userId); // Ищем пользователя по ID
};

// Обработчик GET-запроса для получения всех пользователей
app.get('/users', async (req, res) => {
    try {
        const users = await read(); // Читаем пользователей
        res.status(200).send(users); // Отправляем пользователей с кодом 200 (OK)
    } catch (e) {
        res.status(500).send('Ошибка при получении пользователей: ' + e.message); // Обрабатываем ошибки
    }
});

// Обработчик POST-запроса для создания нового пользователя
app.post('/users', async (req, res) => {
    try {
        const { name, email, password } = req.body; // Извлекаем данные пользователя из тела запроса
        const validationError = validateUserData(name, email, password); // Проверяем данные
        if (validationError) {
            return res.status(400).send(validationError); // Если есть ошибка, отправляем 400 (Bad Request)
        }

        const users = await read(); // Читаем текущих пользователей
        const id = users.length ? users[users.length - 1].id + 1 : 1; // Генерируем новый ID
        const newUser = { id, name, email, password }; // Создаем нового пользователя

        users.push(newUser); // Добавляем нового пользователя в массив
        await write(users); // Записываем обновленный массив пользователей в файл

        res.status(201).send(newUser); // Отправляем созданного пользователя с кодом 201 (Created)
    } catch (e) {
        res.status(500).send('Ошибка при создании пользователя: ' + e.message); // Обрабатываем ошибки
    }
});

// Обработчик GET-запроса для получения пользователя по ID
app.get('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId); // Получаем ID пользователя из параметров запроса
        const user = await getUserById(userId); // Ищем пользователя по ID
        if (!user) {
            return res.status(404).send('Пользователь не найден'); // Если пользователь не найден, отправляем 404 (Not Found)
        }
        res.send(user); // Отправляем найденного пользователя
    } catch (e) {
        res.status(500).send('Ошибка при получении пользователя: ' + e.message); // Обрабатываем ошибки
    }
});

// Обработчик DELETE-запроса для удаления пользователя по ID
app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId); // Получаем ID пользователя из параметров запроса
        const users = await read(); // Читаем текущих пользователей
        const userIndex = users.findIndex(user => user.id === userId); // Находим индекс пользователя по ID
        if (userIndex === -1) {
            return res.status(404).send('Пользователь не найден'); // Если пользователь не найден, отправляем 404 (Not Found)
        }
        users.splice(userIndex, 1); // Удаляем пользователя из массива

        await write(users); // Записываем обновленный массив пользователей в файл
        res.sendStatus(204); // Отправляем статус 204 (No Content) без тела ответа
    } catch (e) {
        res.status(500).send('Ошибка при удалении пользователя: ' + e.message); // Обрабатываем ошибки
    }
});

// Обработчик PUT-запроса для обновления пользователя по ID
app.put('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId); // Получаем ID пользователя из параметров запроса
        const { name, email, password } = req.body; // Извлекаем данные пользователя из тела запроса
        const validationError = validateUserData(name, email, password); // Проверяем данные
        if (validationError) {
            return res.status(400).send(validationError); // Если есть ошибка, отправляем 400 (Bad Request)
        }

        const users = await read(); // Читаем текущих пользователей
        const userIndex = users.findIndex(user => user.id === userId); // Находим индекс пользователя по ID
        if (userIndex === -1) {
            return res.status(404).send('Пользователь не найден'); // Если пользователь не найден, отправляем 404 (Not Found)
        }

        users[userIndex] = { id: userId, name, email, password }; // Обновляем пользователя

        await write(users); // Записываем обновленный массив пользователей в файл
        res.status(200).send(users[userIndex]); // Отправляем обновленного пользователя с кодом 200 (OK)
    } catch (e) {
        res.status(500).send('Ошибка при обновлении пользователя: ' + e.message); // Обрабатываем ошибки
    }
});

// Запускаем сервер на порту 3000
app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
