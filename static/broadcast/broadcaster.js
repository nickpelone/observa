(function () {
    var connection = new RTCMultiConnection().connect();

    connection.session = {
        audio: true,
        video: true,
        oneway: true
    };

    var sessions = {};
    connection.onNewSession = function (session) {
        connection.dontCaptureUserMedia = true;
        session.join({
            oneway: true
        });
    };

    connection.onstream = function(e) {
        $("body").append(e.mediaElement);
    };



    $("#start").click(function (event) {
        this.disabled = true;
        connection.open();
        connection.sendCustomMessage({
            broadcast:true});
        connection.connect();

    });

    connection.onCustomMessage = function (message) {
        if (message.broadcast === true) {
            connection.askToShareParticipants();

            connection.dontCaptureUserMedia = false;
            connection.addStream({
                audio:true,
                video:true
            });
        }
    };
})();
