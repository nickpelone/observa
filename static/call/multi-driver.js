var connection = new RTCMultiConnection().connect();
var backupLocalVideoSrc, backupRemoteVideoSrc;

function changeObservaVideoSource(video, target) {
    if (target === 'local') {
        /* replace the local video stream with the received video */
        var localVideoElement = $(".local_video")[0];
        backupLocalVideoSrc = localVideoElement.src;
        localVideoElement.src = video;
        localVideoElement.play(); //force it to play on the local side

        /* send the message to the other clients to load the video as well */
        var pluginMsg = {
            'message': 'plugin',
            'video': video
        };
        connection.sendCustomMessage(pluginMsg);
    } else if (target === 'remote') {
        /* we are changing the remote's video to the video from the message */
        var remoteVideoElement = $(".remote_video")[0];
        backupRemoteVideoSrc = remoteVideoElement.src;
        remoteVideoElement.src = video;
    }
}
connection.onCustomMessage = function (message) {
    console.log("received a custom message: " + message);
    if (message.message === 'plugin') {
        /* received a video from another client to play */
        changeObservaVideoSource(message.video, 'remote');
    }
};

$("#start_button").click(function (event) {
    connection.open();
});

$("#end_button").click(function (event) {
    connection.sendCustomMessage("hello, world");
});

$("#plugin_button").click(function (event) {
    var pluginRequest = {
        'plugin': 'youtube',
        'request': 'https://www.youtube.com/watch?v=rjQtzV9IZ0Q'
    };
    $.ajax({
        type: 'POST',
        url: '/plugin-handler',
        dataType: 'json',
        async: false,
        data: pluginRequest,
        success: function(data) {
            console.log("Successfully posted");
            console.log(data);
            changeObservaVideoSource(data.video, 'local');
        }
    });
});

