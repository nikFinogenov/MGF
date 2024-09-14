const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const User = require('./models/user');
const app = express();
const port = 3000;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('Новое соединение по WebSocket');

  ws.on('message', function incoming(message) {
    console.log('Получено сообщение:', message);

    ws.send('Сообщение получено!');
  });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));
app.use(express.json());
app.use(express.static('assets'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/reg.html');
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log(name);
    let user = new User(name, email, password);
    await user.save();
    res.status(200).json({ message: 'User created successfully' });
    // if(result.)
  } catch (error) {
    if (error.message.includes("Duplicate")) {
      res.status(400).json({ error: 'A user with the same login or email already exists.' });
      // res.send('A user with the same login or email already exists.');
    }
    else {
      // res.send('An error occurred while registering the user.');
      res.status(500).json({ error: 'An error occurred while registering the user.' });
    }
  }
});
app.post('/login', (req, res) => {
  res.redirect('menu.html');
});
// app.get('/game', (req, res) => {
//   res.sendFile(__dirname + '/frontend/game.html');
// });

// Запускаем сервер
server.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
