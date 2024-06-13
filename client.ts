import * as net from 'net';

const PORT = 50000;
const HOST = 'localhost';

const client = new net.Socket();

client.connect(PORT, HOST, () => {
    console.log('connected to server');
    client.write('Hello 夏秋!');
});

client.on('data', (data: Buffer) => {
    console.log('client-> ' + data.toString());
    // Do not destroy the connection immediately; wait for server's response
    //client.destroy();
});

client.on('close', () => {
    console.log('client-> connection is closed');
});

client.on('error', (err: Error) => {
    console.error('client-> error: ' + err.message);
});