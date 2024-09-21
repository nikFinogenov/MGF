const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/user');
const Game = require('./game')
const app = express();
const port = 3000;

const server = http.createServer(app);
const io = new Server(server);
const rooms = {};

const game = new Game();

io.on('connection', (socket) => {
    socket.on('firstRound', (roomId) => {
        rooms[roomId].actions['turn'] = 1;
        io.to(roomId).emit('firstTurn', rooms[roomId].players[0].id, rooms[roomId].actions['turn']);
    });

    socket.on('userEmail', (email) => {
        socket.email = email;
    });
    socket.on('userAvatar', (avatar) => {
        socket.avatar = avatar;
    });
    socket.on('userName', (name) => {
        socket.name = name;
    });

    socket.on('searchGame', () => {
        let roomId = null;

        for (let id in rooms) {
            if (rooms[id].players.length === 1) {
                roomId = id;
                break;
            }
        }

        if (!roomId) {
            roomId = `room_${socket.id}`;
            rooms[roomId] = { players: [], selections: {}, pickedBuffs: {}, actions: {} };
        }

        rooms[roomId].players.push({
            id: socket.id,
            email: socket.email,
            name: socket.name,
            avatar: socket.avatar
        });
        socket.join(roomId);

        if (rooms[roomId].players.length === 2) {
            const players = rooms[roomId].players;

            io.to(roomId).emit('startGame', {
                roomId,
                players
            });
        }
        else {
        }
    });

    socket.on('cardSelected', (roomId, data) => {
        if (roomId) {
            rooms[roomId].selections[socket.id] = data.card;
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
            }
        }
    });
    socket.on('buffsSelected', (roomId, data) => {
        if (roomId) {
            rooms[roomId].actions[socket.id] = data.status;

            const allPlayersSelected = rooms[roomId].players.every(p => rooms[roomId].actions[p.id]);

            if (allPlayersSelected) {
                io.to(roomId).emit('startTurn', {
                    players: rooms[roomId].players.map(p => ({
                        id: p.id,
                        card: rooms[roomId].selections[p.id]
                    }))
                });
            }
        }
    });
    socket.on('nextRound', (roomId, data) => {
        let turn = rooms[roomId].actions['turn'] % 2;
        rooms[roomId].actions['turn']++;

        io.to(roomId).emit('firstTurn', rooms[roomId].players[turn].id, rooms[roomId].actions['turn'])
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

        for (let buff of playerBuffs) {
            if (buff.buffname === data.buff) {
                found = true;

                if (buff.bufflevel < 4) {
                    buff.bufflevel += 1;
                }


                break;
            }
        }

        if (!found) {
            playerBuffs.push({
                buffname: data.buff,
                buffprice: data.price,
                bufflevel: 1,
                buffRarity: data.rarity
            });
        }
    };

    socket.on('buffSelected', (roomId, data) => {
        if (!rooms[roomId].pickedBuffs[socket.id]) {
            rooms[roomId].pickedBuffs[socket.id] = [];
        }



        addOrUpdateBuff(roomId, socket.id, {
            buff: data.buff,
            price: data.price,
            level: data.level,
            rarity: data.rarity
        });
    });

    socket.on('GetBaseHp', (roomId, data) => {
        const room = rooms[roomId];

        if (!room) {
            console.error(`Комната с ID ${roomId} не найдена`);
            return;
        }

        const p1 = rooms[roomId].players[0];
        const p2 = rooms[roomId].players[1];
        const player1 = rooms[roomId].selections[p1.id];

        const player2 = rooms[roomId].selections[p2.id]

        const hp1 = game.SendBaseHp(player1);
        const hp2 = game.SendBaseHp(player2);

        io.to(roomId).emit('BaseHpResult', {
            players: [
                { id: p1.id, hp: hp1 },
                { id: p2.id, hp: hp2 }
            ]
        });
    });

    socket.on('Attack', (roomId, data) => {
        try {
            const room = rooms[roomId];
            if (!room) {
                throw new Error('Комната не найдена');
            }

            const { attackerId, targetId } = data;
            const attackerName = attackerId.card;
            const targetName = targetId.card;

            const attackerCard = Object.values(room.selections).find(card => card === attackerName);
            const targetCard = Object.values(room.selections).find(card => card === targetName);

            if (!attackerCard || !targetCard) {
                throw new Error('Карта не найдена');
            }

            let damage;
            if (data.value === null) damage = game.AttackEvent(attackerCard, targetCard);
            else damage = game.AttackEventAbility(attackerCard, targetCard, data.value);

            io.to(roomId).emit('AttackResult', {
                attackerId: attackerId,
                targetId: targetId,
                damage: damage,
            });

        } catch (error) {
            console.error('Ошибка при обработке атаки:', error);
        }
    });
    socket.on('Heal', (roomId, data) => {
        try {
            const room = rooms[roomId];
            if (!room) {
                throw new Error('Комната не найдена');
            }

            const { HealId } = data;
            const HealName = HealId.card;

            const HealCard = Object.values(room.selections).find(card => card === HealName);


            if (!HealCard) {
                throw new Error('Карта не найдена');
            }

            let heal = game.HealEvent(HealCard, data.value);;


            io.to(roomId).emit('HealResult', {
                HealId: HealId,
                heal: heal
            });

        } catch (error) {
            console.error('Ошибка при обработке атаки:', error);
        }
    });
    socket.on('Defense', (roomId, data) => {
        try {
            const room = rooms[roomId];
            if (!room) {
                throw new Error('Комната не найдена');
            }

            const { attackerId, targetId } = data;
            const attackerName = attackerId.card;
            const targetName = targetId.card;

            const attackerCard = Object.values(room.selections).find(card => card === attackerName);
            const targetCard = Object.values(room.selections).find(card => card === targetName);

            if (!attackerCard || !targetCard) {
                throw new Error('Карта не найдена');
            }

            let damage;
            game.enableDefenseEvent();

            io.to(roomId).emit('DefenseResult', {
                attackerId: attackerId,
                targetId: targetId,
                damage: damage,
            });

        } catch (error) {
            console.error('Ошибка при обработке атаки:', error);
        }
    });

    socket.on('roundEnd', (data) => {
        const { roomId, loserId } = data;
        const room = rooms[roomId];
        rooms[roomId].actions[socket.id] = "";

        if (!room) {
            console.error(`Комната ${roomId} не найдена`);
            return;
        }

        const winnerId = room.players.find(player => player.id !== loserId).id;

        game.DealDamageToPlayer(rooms[roomId].selections[loserId]);

        io.to(roomId).emit('roundResult', {
            winnerId,
            loserId
        });

        room.roundsPlayed++;
        io.to(roomId).emit('startBuffPhase', {
            phase: 'Buff phase',
            nextRound: room.roundsPlayed + 1
        });
    });

    socket.on('DefenseEnd', () => {
        try {
            game.disableDefenseEvent();
        } catch (error) {
            console.error('Ошибка при обработке атаки:', error);
        }
    })

    socket.on('disconnect', () => {
        for (let roomId in rooms) {
            const room = rooms[roomId];
            const index = room.players.findIndex(p => p.id === socket.id);
            if (index !== -1) {
                room.players.splice(index, 1);
                socket.leave(roomId);

                if (room.players.length === 0) {
                    delete rooms[roomId];
                }
                else if (room.players.length === 1) {
                    io.to(roomId).emit('pause');
                }
            }
        }
    });
});


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


server.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
