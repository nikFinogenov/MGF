const WebSocket = require('ws');

module.exports = function (wss) {
    const users = [];

    wss.on('connection', function connection(ws) {
        console.log('New WebSocket connection');

        // Когда сервер получает сообщение (userEmail)
        ws.on('message', function incoming(message) {
            const data = JSON.parse(message);

            // Добавляем userEmail в список, если его ещё там нет
            if (data.userEmail && !users.includes(data.userEmail)) {
                users.push(data.userEmail);
            }

            // Отправляем список всех email-ов всем подключённым клиентам
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(users));
                }
            });
        });

        // Обработка закрытия соединения
        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });
    });
};
