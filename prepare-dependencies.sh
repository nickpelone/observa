#!/bin/sh

# This script handles the installation of the dependencies needed for Observa. One day, we'll use Grunt or Gulp.

# Check for youtube-dl. We need it for the reference plugin.
command -v youtube-dl >/dev/null 2>&1 || { echo >&2 "Observa's reference plugin requires youtube-dl but it's not installed.  Aborting."; exit 1; }

# First, install Observa's server-side dependencies.
echo "Installing dependencies from npm..."
npm install

# set the npm-exec alias, searches the local modules area first, then the globals to execute a tool
alias npm-exec='PATH=$(npm bin):$PATH'

echo "Installing dependencies from bower..."
cd static && npm-exec bower install
echo "Success! use 'sudo node app.js' or 'sudo npm start' to launch Observa."

