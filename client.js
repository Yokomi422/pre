"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var PORT = 50000;
var HOST = 'localhost';
var client = new net.Socket();
client.connect(PORT, HOST, function () {
    console.log('connected to server');
    client.write('Hello 夏秋!');
});
client.on('data', function (data) {
    console.log('client-> ' + data.toString());
    // Do not destroy the connection immediately; wait for server's response
    //client.destroy();
});
client.on('close', function () {
    console.log('client-> connection is closed');
});
client.on('error', function (err) {
    console.error('client-> error: ' + err.message);
});
