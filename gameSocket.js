const WebSocket = require('ws');

module.exports = function (wss) {
    const users = [];

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            const data = JSON.parse(message);

            if (data.userEmail && !users.includes(data.userEmail)) {
                users.push(data.userEmail);
            }

            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(users));
                }
            });
        });

        ws.on('close', () => {});
    });
};
