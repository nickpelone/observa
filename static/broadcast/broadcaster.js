(function () {
    var connection = new RTCMultiConnection().connect();

    connection.session = {
        audio: true,
        video: true,
        oneway: true
    };

    var sessions = {};
    connection.onNewSession = function (session) {
        console.log("Session found!, attempting to join");
        connection.dontCaptureUserMedia = true;
        session.join({
            oneway: true
        });
        $("#start")[0].disabled = true;
    };

    connection.onstream = function(e) {
        e.mediaElement.className = e.mediaElement.className + 'broadcast_video';
        $("body").append(e.mediaElement);
    };
    connection.userid = (Math.floor(Math.random() * 1000));
    connection.connect(); //signaling

    $("#start").click(function (event) {
        this.disabled = true;
        connection.open(); //open video/audio
        connection.sendCustomMessage({
            broadcast:true});


    });

    connection.onCustomMessage = function (message) {
        console.log("Received a custom message: %j", message);
        if (message.broadcast === true) {
            //connection.askToShareParticipants();

            connection.dontCaptureUserMedia = false;
            connection.addStream({
                audio:true,
                video:true
            });
        }
    };
})();
