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
    var bodyParser = require('body-parser');
    var pluginVideoCount = 0;
    eApp.use(express.static(path.join(__dirname, "../../static")));
    eApp.use('/plugin-depot', express.static('/tmp/observa'));
    eApp.use(bodyParser.json());
    eApp.use(bodyParser.urlencoded({ extended: true }));

    eApp.post('/plugin-handler', function (req, res) {
        /* an observaPluginRequest looks like this:
            {
                'plugin': 'youtube',
                'request': 'http://youtube.com/blablabla'
            }
        */
        console.log("Observa Web Middleware: Received a plugin request: %j ",req.body);

        var plugin = require('../observa_plugins/observa_plugin_' + req.body.plugin + '/' + req.body.plugin + '.json');

        /* a plugin looks like this:
            {
                'plugin': 'youtube',
                'name': 'Youtube reference plugin',
                'action': 'youtube-dl -o'
            }
        */

        var exec = require('child_process').exec;
        var pluginDepotPath = '/tmp/observa/';
        var plugin_script_process = exec(plugin.action + ' ' + pluginDepotPath + pluginVideoCount + '.mp4 ' + req.body.request, function (error, stdout, stderr) {
            console.log(stderr);
            console.log(stdout);
            console.log(error);
            if (error === null) {
                /* we successfully ran the external script */
                var observaPluginResponse = {
                    'video': '/plugin-depot/' + pluginVideoCount + '.mp4',
                };
                pluginVideoCount++;
                res.send(observaPluginResponse);
            } else {
                var errMsg = {error: error,
                              stderr: stderr
                             };
                res.send(errMsg);
            }
        });
    });

    eApp.listen(port, function () {
        console.log("Web Interface is up on port " + port);
    });

};
