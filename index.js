const express = require('express');
const { read, write } = require('./userStorage');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Функция для проверки данных пользователя
const validateUserData = (name, email, password) => {
    if (!name || name.length < 3) {
        return 'Имя обязательно и должно быть не менее 3 символов';
    }
    if (!email || !email.includes('@')) {
        return 'Email обязателен и должен быть действительным';
    }
    if (!password || password.length < 6) {
        return 'Пароль обязателен и должен быть не менее 6 символов';
    }
    return null;
};

// Функция для получения пользователя по ID
const getUserById = async (userId) => {
    const users = await read();
    return users.find(user => user.id === userId);
};

app.get('/users', async (req, res) => {
    try {
        const users = await read();
        res.status(200).send(users);
    } catch (e) {
        res.status(500).send('Ошибка при получении пользователей: ' + e.message);
    }
});

app.post('/users', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const validationError = validateUserData(name, email, password);
        if (validationError) {
            return res.status(400).send(validationError);
        }

        const users = await read();
        const id = users.length ? users[users.length - 1].id + 1 : 1; // Генерация ID
        const newUser = { id, name, email, password };

        users.push(newUser);
        await write(users);

        res.status(201).send(newUser);
    } catch (e) {
        res.status(500).send('Ошибка при создании пользователя: ' + e.message);
    }
});

app.get('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).send('Пользователь не найден');
        }
        res.send(user);
    } catch (e) {
        res.status(500).send('Ошибка при получении пользователя: ' + e.message);
    }
});

app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const users = await read();
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).send('Пользователь не найден');
        }
        users.splice(userIndex, 1);

        await write(users);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).send('Ошибка при удалении пользователя: ' + e.message);
    }
});

app.put('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const { name, email, password } = req.body;
        const validationError = validateUserData(name, email, password);
        if (validationError) {
            return res.status(400).send(validationError);
        }

        const users = await read();
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).send('Пользователь не найден');
        }

        users[userIndex] = { id: userId, name, email, password }; // Обновляем пользователя

        await write(users);
        res.status(200).send(users[userIndex]);
    } catch (e) {
        res.status(500).send('Ошибка при обновлении пользователя: ' + e.message);
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});
