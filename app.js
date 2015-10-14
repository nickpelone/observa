#!/usr/bin/env node

var observaWeb = require("./observa_modules/web_middleware/web.js");

/* clean the temporary folder Observa uses for plugin content */
var exec = require('child_process').exec;

var tmpCleaner = exec("rm -rfd /tmp/observa", function (error, stdout, stderr) {
    if (error) throw error;
    if (stderr) console.log(stderr);
});

/* load modules */
observaWeb.startWebInterface(8080);
