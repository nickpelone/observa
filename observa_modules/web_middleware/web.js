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
    eApp.use(express.static(path.join(__dirname,"../../static")));
    
    eApp.get('/turn-servers', function (request, response) {
        //get turn servers from google
        var url = "https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913";
        request(url, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        response.setHeader('Content-Type', 'application/json');
                        response.end(body);
                    }
        });
    });

    eApp.listen(port, function () {
        console.log("Web Interface is up on port " + port);
    });
    
};


