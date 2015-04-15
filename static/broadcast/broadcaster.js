(function () {
    var connection = new RTCMultiConnection().connect();

    connection.session = {
        audio: true,
        video: true,
        oneway: true
    };

    connection.open();
})();
