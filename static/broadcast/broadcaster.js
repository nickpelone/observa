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
        document.body.appendChil(e.mediaElement);
    };

    connection.connect();

    $("#start").click(function (event) {
        this.disabled = true;
        connection.open();
    });

    connection.open(location.href.replace(/\/|:|#|%|\.|\[|\]/g, ''));
})();
