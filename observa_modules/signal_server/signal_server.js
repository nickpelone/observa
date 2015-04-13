/*jshint node:true */
// This contains the signaling server functions and related

var exports = module.exports = {};

exports.startSignalServer = function (port) {
    var http = require('http');
    var signalServerApp = http.createServer(function (request, response) {
    }).listen(port);
    var io = require('socket.io').listen(signalServerApp);
    
    io.sockets.on('connection', function (socket) {
        socket.emit('hello', {'hello': 'world'});
        console.log("Sent a hello to: " + socket.id);
        function log() {
            var msgArray = ["!! Message from Observa Server: "];
            for (var i = 0; i < arguments.length; i++) {
                msgArray.push(arguments[i]);
            }
            socket.emit('log', msgArray);
        }
        
        socket.on('message', function (message) {
            log('Observa Server Got a message:', message);
            socket.broadcast.emit('message', message);
        });
        
        socket.on('create or join', function(room) {
            console.log("Observa Server got a create/join");
            
            var clients = io.sockets.adapter.rooms[room];
            var clientCount = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
            log("Chatroom " + room + ' has ' + clientCount + ' client(s)');
            log("Request to create or join room " + room);
            
            if (clientCount === 0) {
                //the requested room is empty
                socket.join(room);
                socket.emit('created', room);
                console.log('room ' + room + ' created, clientcount:' + clientCount);
            } else if (clientCount === 1) {
                io.sockets.in(room).emit('join', room);
                socket.join(room);
                socket.emit('joined', room);
                console.log('trying to tell client to join ' + room);

            } else {
                //for direct calls we place a limit at 2 clients
                socket.emit('full', room);
            }
            socket.emit('emit(): client' + socket.id + ' jointed room ' + room);
            socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);
        });
    });

    console.log("Signal Server up on " + port);

};


