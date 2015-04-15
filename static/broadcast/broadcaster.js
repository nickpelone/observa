(function () {
    var connection = new RTCMultiConnection().connect();

    connection.session = {
        audio: true,
        video: true,
        oneway: true
    };

    var sessions = {};
    connection.onNewSession = function (session) {
        if(sessions[session.sessionid]) return;
        sessions[session.sessionid] = session;
        connection.join(session);
    };

    connection.open(location.href.replace(/\/|:|#|%|\.|\[|\]/g, ''));
})();
