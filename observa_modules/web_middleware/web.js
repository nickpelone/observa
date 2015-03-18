#!/usr/bin/env node
/* This is not the file to launch Observa!
 * See src/app.js
 */
var exports = module.exports = {};

exports.startWebInterface = function (port) {
    var express = require('express');
    var eApp = express();
    
    eApp.get('/', function(request, response) {
        response.send("hello");
    });
    
    eApp.listen(port, function () {
        console.log("Web Interface is up on port " + port);
    });
    
};


