#!/usr/bin/env node

var observaWeb = require("./observa_modules/web_middleware/web.js");
var observaSignalServer = require("./observa_modules/signal_server/signal_server.js");

observaWeb.startWebInterface(8080);
observaSignalServer.startSignalServer(1234);

