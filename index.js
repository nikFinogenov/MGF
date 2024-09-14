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
  res.sendFile(__dirname + '/views/login.html');
});

app.post('/register', async (req, res) => {
  try {
    // const { name, email, password } = req.body;
    let user = new User(req.body.name, req.body.email, req.body.password);
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
app.post('/login', async (request, response) => {
  try {
    // const { email, password } = req.body;
      let user = new User('', request.body.email, request.body.password);
      let name = await user.checkUser();
      user.name = name;
      // console.log(user);
      response.status(200).json({ user: user, message: 'Logged in successfully' });
  } catch (error) {
      // console.log(error);
      if (error.message.includes("Does not match")) {
          response.status(400).json({ error: "Login or password doesn't match" });
      }
      else {
        console.error(error);
          response.status(500).json({ error: 'An error occurred while logining the user.' });
      }
  }
});
// app.get('/game', (req, res) => {
//   res.sendFile(__dirname + '/frontend/game.html');
// });

// Запускаем сервер
server.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
