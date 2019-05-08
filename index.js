const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const BlockchainParser = require('./workers/blockchainParser');

server.listen(3002);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {

    const blockchainParser = new BlockchainParser();
    socket.join('buy');
    socket.join('sell');
    let interval = -1;

    socket.on('send', data => {
        blockchainParser.setTimer(data.timer);
        clearInterval(interval);
        interval = setInterval(() => {
            socket.emit('btc', blockchainParser.getData(data.currency))
        }, data.timer * 1000);
    });

    socket.on('room', data => {
        let { content, room } = data;
        if (room === 'buy' || room === 'sell') {
            socket.nsp.to(room).emit('room', {
                room,
                content
            })
        }
    });
});