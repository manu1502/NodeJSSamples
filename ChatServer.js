var net = require('net');
var chatServer = net.createServer();
clientList = [];

chatServer.on('connection', function (client) {
    client.name = client.remoteAddress + ":" + client.remotePort;

    client.write('Hi, You are : ' + client.name + '\r\n');
    clientList.push(client);
    client.write("You :: ");
    console.log(client.name + ' joined');
    client.message = '';


    client.on('data', function (data) {
       
        if (data.toString() == '\r\n') {
            client.message = client.message + data;
            
            broadcast(client.message, client);
            client.message = '';
            client.write("\r\n" + "You :: ");
        }
        else {
            client.message = client.message + data;
        }
    });

    client.on('end', function () {
        console.log(client.name + ' quit')
        clientList.splice(clientList.indexOf(client), 1)
    })
    client.on('error', function (e) {
        console.log(e)
    })
});

        //client.end();
function broadcast(message, client) {
    for (var i = 0; i < clientList.length; i += 1) {
        if (client !== clientList[i]) {
            clientList[i].write("\r\n" + client.name + " says::  " + message)
            clientList[i].write("You :: ");
        }
    }
}

chatServer.listen(9000);

