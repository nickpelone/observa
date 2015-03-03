#!/usr/bin/env node

var express = require('express')
var app  = express();
var serviceStatus = 'down';

/* API Routes - These take in info from the client */

app.get('/', function(request, response) {
    res.send("hello");
});

app.get('/status', function(request, response) {
    response.send(serverStatus);
});    

function createATVServer(app) {
    var expressServer = app.listen(8080, function () {
        console.log("Server is up on: " + expressServer.address().address);
        serverStatus = 'up';
    });
}

var ATVServer = createATVServer(app);
