const net = require('net');

const server = net.createServer(socket => {
    socket.on('data', data => {
        console.log(data + ' from ' + socket.remoteAddress + ':' + socket.remotePort);
        socket.write('server -> Repeating: ' + data);
    });

    socket.on('close', () => {
        console.log('client closed connection');
    });
}).listen(3000);

console.log('listening on port 3000');
