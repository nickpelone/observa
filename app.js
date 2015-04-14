#!/usr/bin/env node

var observaWeb = require("./observa_modules/web_middleware/web.js");
var observaSignalServer = require("./observa_modules/signal_server/new_signal_server.js");

observaWeb.startWebInterface(80);
observaSignalServer.startSignalServer(1234);

