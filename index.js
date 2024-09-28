const express = require('express')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const users = [
    { "id": 1, "name": "Иван Иванов", "email": "ivan@example.com", "password": "password321" },
    { "id": 2, "name": "Мария Петрова", "email": "maria@example.com", "password": "qwerty345" },
    { "id": 3, "name": "Алексей Сидоров", "email": "alex@example.com", "password": "123456" },
    { "id": 4, "name": "Ольга Иванова", "email": "olga@example.com", "password": "password" },
    { "id": 5, "name": "Дмитрий Петров", "email": "dmitry@example.com", "password": "qwerty123" },
    { "id": 6, "name": "Анна Сидорова", "email": "anna@example.com", "password": "password1234" },
    { "id": 7, "name": "Сергей Иванов", "email": "sergey@example.com", "password": "qwerty" },
    { "id": 8, "name": "Елена Петрова", "email": "elena@example.com", "password": "654321" },
    { "id": 9, "name": "Андрей Сидоров", "email": "andrey@example.com", "password": "password123" },
    { "id": 10, "name": "Наталья Иванова", "email": "natalia@example.com", "password": "qwerty" }
]

app.get('/users', (req, res) => {
    try {
       res.send(users)
    }catch (e) {
        res.status(500).send(e.message)
    }
})

app.post('/users', (req, res) => {
    // console.log(req.body)
    // console.log(req.params)
    // console.log(req.query)
    res.send('Hello world!')
})

app.get('/users/:userId', (req, res) => {
    // console.log(req.body)
    // console.log(req.params)
    // console.log(req.query)
    res.send('Hello world!')
})

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000')
})
