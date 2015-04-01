/*jshint node:true */
// This contains the signaling server functions and related

var exports = module.exports = {};

exports.startSignalServer = function (port) {
    var http = require('http');
    var signalServerApp = http.createServer(function (request, response) {
    }).listen(port);
    var io = require('socket.io').listen(signalServerApp);
    
    io.sockets.on('connection', function (socket) {
        function log() {
            var msgArray = ["!! Message from server: "];
            for (var i = 0; i < arugments.length; i++) {
                msgArray.push(arguments[i]);
            }
            socket.emit('log', msgArray);
        }
        
        socket.on('message', function (message) {
            log('Got a message:', message);
            socket.broadcast.emit('message', message);
        });
        
        socket.on('create or join', function(room) {
            var clientCount = io.sockets.clients(room).length;
            
            log("Chatroom " + room + ' has ' + clientCount + ' client(s)');
            log("Request to create or join room " + room);
            
            if (clientCount === 0) {
                //the requested room is empty
                socket.join(room);
                socket.emit('created', room);
            } else if (clientCount === 1) {
                io.sockets.in(room).emit('join', room);
                socket.join(room);
                socket.emit('joined', room);
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


