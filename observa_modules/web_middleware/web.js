#!/usr/bin/env node

/* This is not the file to launch Observa!
 * See src/app.js
 */
var exports = module.exports = {};

exports.startWebInterface = function (port) {
    var express = require('express');
    var path = require('path');
    var eApp = express();
    var request = require('request');
    var pluginVideoCount = 0;
    eApp.use(express.static(path.join(__dirname, "../../static")));
    eApp.use('/plugin-depot', express.static('/tmp/observa'));

    eApp.post('/plugin-handler', function (req, res) {
        /* an observaPluginRequest looks like this:
            {
                'plugin': 'youtube',
                'request': 'http://youtube.com/blablabla'
            }
        */
        console.log("Observa Web Middleware: Received a plugin request: %j ",req.body);

        var plugin = require('../observa_plugins/observa_plugin_' + req.plugin + '/' + req.plugin + '.json');

        /* a plugin looks like this:
            {
                'plugin': 'youtube',
                'name': 'Youtube reference plugin',
                'action': 'youtube-dl -o'
            }
        */

        var exec = require('child_process').exec;
        var pluginDepotPath = '/tmp/observa/';
        var plugin_script_process = exec(plugin.action + ' ' + pluginDepotPath + pluginVideoCount + '.mp4' + req.request, function (error, stdout, stderr) {
            pluginVideoCount++;
            if (error === null) {
                /* we successfully ran the external script */
                var observaPluginResponse = {
                    'video': 'http://observa.nickpelone.com/plugin-depot/' + pluginVideoCount + '.mp4',
                };
                res.json(observaPluginResponse);
            }
        });
    });

    eApp.listen(port, function () {
        console.log("Web Interface is up on port " + port);
    });

};
