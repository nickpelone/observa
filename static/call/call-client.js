(function () {
    "use strict";
    console.log("call-client.js loaded");

    /* variable declarations */
    var endButton = $("#end_button")[0];
    var room = '';

    //set up the 'room' var to handle individual call sessions
    if (room === '') {
        // TODO: multuple rooms
        //  room = prompt('Enter room name:');
        room = 'foo';
    } else {
        //
    }
    // click handlers

    $("#end_button").click(hangup);

    getUserMedia(userMediaConstraints, handleUserMedia, genericErrorHandler);
    console.log("Got local user media with constraints %j", userMediaConstraints);
    if (room !== '') {
        console.log('Create or join room', room);
        socket.emit('create or join', room);
    }



})();
