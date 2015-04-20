#!/bin/sh

# This script handles the installation of the dependencies needed for Observa. One day, we'll use Grunt or Gulp.

# First, install Observa's server-side dependencies.
echo "Installing dependencies from npm..."
npm install

# set the npm-exec alias, searches the local modules area first, then the globals to execute a tool
alias npm-exec='PATH=$(npm bin):$PATH'

echo "Installing dependencies from bower..."
cd static && npm-exec bower install
echo "Success! use 'sudo node app.js' or 'npm start' to launch Observa."

