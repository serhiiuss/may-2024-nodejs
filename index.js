const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const DATABASE_FILE = './db.json';


function initializeDatabase() {
    if (!fs.existsSync(DATABASE_FILE)) {
        fs.writeFileSync(DATABASE_FILE, JSON.stringify([]));
    }
}


function getDatabase() {
    initializeDatabase();
    const content = fs.readFileSync(DATABASE_FILE, 'utf-8');
    return JSON.parse(content || '[]');
}


function updateDatabase(data) {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 2));
}


app.get('/users', (_, res) => {
    const users = getDatabase();
    res.status(200).json(users);
});


app.get('/users/:id', (req, res) => {
    const users = getDatabase();
    const user = users.find(user => user.id === Number(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
});


app.post('/users', (req, res) => {
    const users = getDatabase();
    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        ...req.body,
    };
    users.push(newUser);
    updateDatabase(users);
    res.status(201).json(newUser);
});


app.put('/users/:id', (req, res) => {
    const users = getDatabase();
    const userIndex = users.findIndex(user => user.id === Number(req.params.id));

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex] = { ...users[userIndex], ...req.body };
    updateDatabase(users);
    res.status(200).json(users[userIndex]);
});


app.delete('/users/:id', (req, res) => {
    const users = getDatabase();
    const filteredUsers = users.filter(user => user.id !== Number(req.params.id));

    if (filteredUsers.length === users.length) {
        return res.status(404).json({ error: 'User not found' });
    }

    updateDatabase(filteredUsers);
    res.status(204).send();
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
