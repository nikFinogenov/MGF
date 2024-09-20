const express = require('express');
const http = require('http');
// const WebSocket = require('ws');
const { Server } = require('socket.io');
const User = require('./models/user');
const Game = require('./game')
const app = express();
const port = 3000;

// Создаем HTTP-сервер
const server = http.createServer(app);
const io = new Server(server);
const rooms = {}; // Объект для хранения комнат

const game = new Game();

io.on('connection', (socket) => {
    console.log('New player connected:', socket.id);
    socket.on('firstRound', (roomId) => {
        rooms[roomId].actions['turn'] = 1;
        io.to(roomId).emit('firstTurn', rooms[roomId].players[0].id, rooms[roomId].actions['turn']);
            // console.log(rooms[roomId].players[randomNumber]);
            // console.log(randomNumber)
    });

    // Получаем email пользователя
    socket.on('userEmail', (email) => {
        socket.email = email; // Сохраняем email в сокете
    });
    socket.on('userAvatar', (avatar) => {
        socket.avatar = avatar; // Сохраняем email в сокете
    });
    socket.on('userName', (name) => {
        socket.name = name; // Сохраняем email в сокете
    });

    // socket.on('userId', (idd) => {
    //   socket.idd = idd; // Сохраняем email в сокете
    // });

    // Обработчик поиска игры
    socket.on('searchGame', () => {
        let roomId = null;

        // Ищем комнату с одним игроком
        for (let id in rooms) {
            if (rooms[id].players.length === 1) {
                roomId = id;
                break;
            }
        }

        // Если нет комнаты, создаем новую
        if (!roomId) {
            roomId = `room_${socket.id}`;
            rooms[roomId] = { players: [], selections: {}, pickedBuffs: {}, actions: {} };
        }

        // Присоединяем игрока к комнате
        rooms[roomId].players.push({
            id: socket.id,
            email: socket.email,
            name: socket.name,
            avatar: socket.avatar
        });
        socket.join(roomId);
        console.log(`Player ${socket.id} joined room ${roomId}`);

        // Если два игрока в комнате, начинаем игру
        if (rooms[roomId].players.length === 2) {
            const players = rooms[roomId].players;

            // Отправляем обоим игрокам информацию о противнике
            console.log(`---->${socket.id} started game in ${roomId}`);
            io.to(roomId).emit('startGame', {
                roomId,
                players
            });
        }
        else {
            // console.log("pidoras");
            // socket.emit('loadingScreen');
        }
    });

    socket.on('cardSelected', (roomId, data) => {
        console.log(`Player ${data.playerId} selected card: ${data.card}`);

        if (roomId) {
            rooms[roomId].selections[socket.id] = data.card;

            console.log(`Current selections for room ${roomId}:`, rooms[roomId].selections);

            // Check if both players have selected their cards
            const allPlayersSelected = rooms[roomId].players.every(p => rooms[roomId].selections[p.id]);
            if (allPlayersSelected) {
                const player1 = rooms[roomId].players[0];
                const player2 = rooms[roomId].players[1];
                game.InputCards(
                    rooms[roomId].selections[player1.id],
                    rooms[roomId].selections[player2.id]
                );
                io.to(roomId).emit('startRound', {
                    players: rooms[roomId].players.map(p => ({
                        id: p.id,
                        card: rooms[roomId].selections[p.id]
                    }))
                });
                console.log(`Both players have selected their cards. Emitting round event.`);
            }
        }
    });
    socket.on('buffsSelected', (roomId, data) => {
        console.log(`Player ${data.playerId} is ready!`);

        if (roomId) {
            rooms[roomId].actions[socket.id] = data.status;

            const allPlayersSelected = rooms[roomId].players.every(p => rooms[roomId].actions[p.id]);

            console.log(allPlayersSelected);

            if (allPlayersSelected) {
                // Notify both players that the selection is complete
                io.to(roomId).emit('startTurn', {
                    players: rooms[roomId].players.map(p => ({
                        id: p.id,
                        card: rooms[roomId].selections[p.id]
                    }))
                });
                console.log(`Both players are ready. Emitting turn event.`);
            }
        }
    });
    socket.on('nextRound', (roomId, data) => {
        let turn = rooms[roomId].actions['turn'] % 2;
        // if(rooms[roomId].actions['turn'] === 1) turn--;
        rooms[roomId].actions['turn']++;

        console.log(rooms[roomId].actions['turn'] + " - " + turn);
        io.to(roomId).emit('firstTurn', rooms[roomId].players[turn].id, rooms[roomId].actions['turn'] )
        // console.log("next");
    });
    const rarityRanking = {
        'Common': 1,
        'Rare': 2,
        'Epic': 3,
        'Legendary': 4
    }; 
    function addOrUpdateBuff(roomId, socketId, data) {
        const playerBuffs = rooms[roomId].pickedBuffs[socketId];
        let found = false;

        // Iterate through the existing buffs to check if the buff already exists
        for (let buff of playerBuffs) {
            if (buff.buffname === data.buff) {
                found = true;

                // If the buff level is less than 4, increment the level
                if (buff.bufflevel < 4) {
                    buff.bufflevel += 1;
                }

                // Update rarity if the new buff has a higher rarity
                // if (rarityRanking[data.rarity] > rarityRanking[buff.buffRarity]) {
                //     buff.buffRarity = data.rarity;
                //     buff.buffprice = data.price; // Optionally update other fields
                // }

                break;
            }
        }

        // If the buff was not found, push the new buff with level 1
        if (!found) {
            playerBuffs.push({
                buffname: data.buff,
                buffprice: data.price,
                bufflevel: 1, // Start with level 1 for new buffs
                buffRarity: data.rarity
            });
        }
    };

    socket.on('buffSelected', (roomId, data) => {
        console.log(`Player ${data.playerId} selected buff: ${data.buff}`);

        // Инициализация массива баффов для конкретного игрока, если не существует
        if (!rooms[roomId].pickedBuffs[socket.id]) {
            rooms[roomId].pickedBuffs[socket.id] = [];
        }


        // if(rooms[roomId].pickedBuffs[socket.id]) //

        // Добавляем новый бафф в массив баффов игрока
        // rooms[roomId].pickedBuffs[socket.id].push({
        //     buffname: data.buff, 
        //     buffprice: data.price,
        //     bufflevel: data.level,
        //     buffRarity: data.rarity
        // });
        addOrUpdateBuff(roomId, socket.id, {
            buff: data.buff,
            price: data.price,
            level: data.level,
            rarity: data.rarity
        });

        console.log(`Picked buffs for room ${roomId}:`, rooms[roomId].pickedBuffs);


        // Отправляем событие с выбранными баффами всем игрокам в комнате
        // io.to(roomId).emit('startTurn', {
        //     players: rooms[roomId].players.map(p => ({
        //         id: p.id,
        //         buffs: rooms[roomId].pickedBuffs[p.id] // Передаём массив баффов для каждого игрока
        //     }))
        // });
    });

    socket.on('Attack', (roomId, data) => {
        try {
            // Проверяем наличие комнаты и игроков
            const room = rooms[roomId];
            if (!room) {
                throw new Error('Комната не найдена');
            }
    
            const { attackerId, targetId } = data;
            const attackerName = attackerId.card;
            const targetName = targetId.card;
    
            // Получаем экземпляры карт игроков по их именам
            const attackerCard = Object.values(room.selections).find(card => card === attackerName);  // Карта атакующего
            const targetCard = Object.values(room.selections).find(card => card === targetName);      // Карта цели
            
            console.log(attackerCard);
            console.log(targetCard);
    
            if (!attackerCard || !targetCard) {
                throw new Error('Карта не найдена');
            }
    
            // Вызываем метод useAttack у карты атакующего и передаем карту цели
            const damage = game.AttackEvent(attackerCard,targetCard)
    
            // Логируем нанесенный урон
            console.log(`Игрок ${attackerName} атаковал игрока ${targetName}, нанося урон: ${damage}`);
    
            // Отправляем результат урона обоим игрокам
            io.to(roomId).emit('AttackResult', {
                attackerId: attackerId,
                targetId: targetId,
                damage: damage
            });
    
        } catch (error) {
            console.error('Ошибка при обработке атаки:', error);
        }
    });

    // Обработчик выхода игрока
    socket.on('disconnect', () => {
        for (let roomId in rooms) {
            const room = rooms[roomId];
            const index = room.players.findIndex(p => p.id === socket.id);
            if (index !== -1) {
                room.players.splice(index, 1);
                socket.leave(roomId);
                console.log(`Player ${socket.id} left room ${roomId}`);

                // Удаляем комнату, если она пустая
                if (room.players.length === 0) {
                    delete rooms[roomId];
                    console.log(`Room ${roomId} deleted`);
                }
                else if (room.players.length === 1) {
                    io.to(roomId).emit('pause');
                }
            }
        }
    });
});

// Подключаем WebSocket-логику //nahui web-socket logiku, mi socket.io chads teper
// require('./gameSocket')(wss);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('views'));
app.use(express.json());
app.use(express.static('json'));
app.use(express.static('assets'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

app.post('/register', async (req, res) => {
    try {
        let user = new User(req.body.name, req.body.email, req.body.password);
        await user.save();
        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        if (error.message.includes("Duplicate")) {
            res.status(400).json({ error: 'A user with the same email already exists.' });
        } else {
            res.status(500).json({ error: 'An error occurred while registering the user.' });
        }
    }
});

app.put('/user/:userid', async function (req, res) {
    try {
        let user = new User(req.body.name, req.body.email, null);
        user.avatar = req.body.avatar;
        if (req.body.old) user.password = req.body.old;
        user.id = req.params.userid;
        if (req.body.old) await user.savePass(req.body.new);
        else await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        if (error.message.includes("Duplicate")) {
            res.status(400).json({ error: 'A user with the same email already exists.' });
        } else if (error.message.includes("Password mismatch")) {
            res.status(400).json({ error: 'Current password is wrong' });
        } else {
            res.status(500).json({ error: 'An error occurred while updating the user.' });
        }
    }
});

app.post('/login', async (request, response) => {
    try {
        let user = new User('', request.body.email, request.body.password);
        let row = await user.checkUser();
        user.name = row.name;
        user.id = row.id;
        user.avatar = row.avatar;
        response.status(200).json({ user: user, message: 'Logged in successfully' });
    } catch (error) {
        if (error.message.includes("Does not match")) {
            response.status(400).json({ error: "Login or password doesn't match" });
        } else {
            console.error(error);
            response.status(500).json({ error: 'An error occurred while logging in the user.' });
        }
    }
});

// const game = new Game(1, 2);
// game.startGame();

// Запускаем сервер
server.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
