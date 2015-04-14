/* jshint node:true */

/* This is the signal server, which handles*/

var exports = module.exports = {};

exports.startSignalServer = function (port) {
    var http = require('http');
    var signalServerApp = http.createServer(function (request, response) {}).listen(port);
    /* Attach socket.io to the http server instance */
    var io = require('socket.io').listen(signalServerApp);

    /* this is all the signaling required by RTCMultiConnection */
    io.sockets.on('connection', function (socket) {
        var pluginVideoCount = 0;
        socket.on('message', function (data) {
            socket.broadcast.emit('message', data);
        });

        /* here we handle plugin requests */
        socket.on('observaPluginRequest', function (obsReq) {
            /* an observaPluginRequest looks like this:
                {
                    'plugin': 'youtube',
                    'request': 'http://youtube.com/blablabla'
                }
            */
            console.log(obsReq);

            var plugin = require('../observa_plugins/observa_plugin_' + obsReq.plugin + '/' + obsReq.plugin + '.js');

            /* a plugin looks like this:
                {
                    'plugin': 'youtube',
                    'name': 'Youtube reference plugin',
                    'action': 'youtube-dl -o'
                }
            */

            var exec = require('child_process').exec;
            var plugin_script_process = exec(plugin.action + ' ' + pluginVideoCount + '.mp4' + obsReq.request, function (error, stdout, stderr) {
                pluginVideoCount++;
                if (error === null) {
                    /* we successfully ran the external script */
                    var observaPluginResponse = {
                        'video': 'http://observa.nickpelone.com/plugin_depot/' + pluginVideoCount + '.mp4',
                    };
                    socket.broadcast.emit('observaPluginResponse', observaPluginResponse);
                }
            });
        });
    });
};
