#!/usr/bin/env node

var observaWeb = require("./observa_modules/web_middleware/web.js");

/* clean the temporary folder Observa uses for plugin content */
var exec = require('child_process').exec;

var tmpCleaner = exec("rm -rfd /tmp/observa", function (error, stdout, stderr) {
    if (error) throw error;
    if (stderr) console.log(stderr);
});

/* load modules */
observaWeb.startWebInterface(80);

/* drop privs back down to a normal user so Observa doesn't run as root */
try {
    var uid = parseInt(process.env.SUDO_UID);
    if (uid) process.setuid(uid);
    console.log("Observa has dropped to UID " + uid);
} catch (e) {
    console.log("Error in dropping privs to normal user: \n Do you have sudo rights?");
    process.exit(1); //expose error code to underlying OS
}
