const express = require('express');
const http = require('http');
const WebSocket = require('ws');

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

app.use(express.static('views'));
app.use(express.static('assets'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/reg.html');
});

app.post('/register', (req, res) => {
  res.redirect('login.html');
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
