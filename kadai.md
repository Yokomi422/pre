client.ts
import * as net from 'net';

const PORT = 50000;
const HOST = 'localhost';

const client = new net.Socket();

client.connect(PORT, HOST, () => {
    console.log('connected to server');
    client.write('Hello World!');
});

client.on('data', (data: Buffer) => {
    console.log('client-> ' + data.toString());
    client.destroy();
});

client.on('close', () => {
    console.log('client-> connection is closed');
});

client.on('error', (err: Error) => {
    console.error('client-> error: ' + err.message);
});

server.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <poll.h>

#define MAX_CLIENTS 100

void broadcast_message(int sender_socket, char *message, int message_len, struct pollfd *fds, int client_count) {
    for (int i = 1; i < client_count; ++i) {
        if (fds[i].fd != sender_socket) {
            send(fds[i].fd, message, message_len, 0);
        }
    }
}

int main(int argc, char **argv) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <port>\n", argv[0]);
        return 1;
    }

    const int PORT = atoi(argv[1]);

    int server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket == -1) {
        perror("socket");
        return 1;
    }

    struct sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    if (bind(server_socket, (struct sockaddr *)&server_addr, sizeof(server_addr)) == -1) {
        perror("bind");
        close(server_socket);
        return 1;
    }

    if (listen(server_socket, MAX_CLIENTS) == -1) {
        perror("listen");
        close(server_socket);
        return 1;
    }

    struct pollfd fds[MAX_CLIENTS + 1];
    fds[0].fd = server_socket;
    fds[0].events = POLLIN;
    int client_count = 1;

    char recv_buf[1024];
    int recv_size;

    while (1) {
        int poll_count = poll(fds, client_count, -1);
        if (poll_count == -1) {
            perror("poll");
            break;
        }

        for (int i = 0; i < client_count; ++i) {
            if (fds[i].revents & POLLIN) {
                if (fds[i].fd == server_socket) {
                    struct sockaddr_in client_addr;
                    socklen_t client_len = sizeof(client_addr);
                    int client_socket = accept(server_socket, (struct sockaddr *)&client_addr, &client_len);
                    if (client_socket == -1) {
                        perror("accept");
                    } else {
                        if (client_count < MAX_CLIENTS + 1) {
                            fds[client_count].fd = client_socket;
                            fds[client_count].events = POLLIN;
                            client_count++;
                            printf("New client connected\n");
                        } else {
                            printf("Max clients reached. Rejecting new client.\n");
                            close(client_socket);
                        }
                    }
                } else {
                    recv_size = recv(fds[i].fd, recv_buf, sizeof(recv_buf), 0);
                    if (recv_size > 0) {
                        broadcast_message(fds[i].fd, recv_buf, recv_size, fds, client_count);
                    } else if (recv_size == 0) {
                        printf("Client disconnected\n");
                        close(fds[i].fd);
                        fds[i] = fds[client_count - 1];
                        client_count--;
                    }
                }
            }
        }
    }

    for (int i = 0; i < client_count; ++i) {
        close(fds[i].fd);
    }
    close(server_socket);
    return 0;
}

ts側で繋がったら、
```javascript
node client.js 
connected to server
```

となるが、serverの方にhello worldが表示されないのはどうして