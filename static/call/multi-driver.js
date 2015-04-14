var connection = new RTCMultiConnection().connect();

function changeObservaVideoSource(video, target) {
    var pluginArea = $("#plugin_content_area")[0];
    if (target === 'local') {
        $(".local_video").toggle();
        $("#plugin_content_area").toggle();
        $("#plugin_content_area").toggleClass('local_video');
        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginArea.onended = function () {
            $(".local_video").toggle();
            $("#plugin_content_area").toggle();
            $("#plugin_content_area").toggleClass('local_video');
        };

        /* send the message to the other clients to load the video as well */
        var pluginMsg = {
            'message': 'plugin',
            'video': video
        };
        connection.sendCustomMessage(pluginMsg);
    } else if (target === 'remote') {
        $(".remote_video").toggle();
        $("#plugin_content_area").toggle();
        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginArea.onended = function () {
            $(".remote_video").toggle();
            $("#plugin_content_area").toggle();
        };

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
    var prompted_video = prompt("Please enter a YouTube video URL.", 'https://www.youtube.com/watch?v=rjQtzV9IZ0Q');
    var pluginRequest = {
        'plugin': 'youtube',
        'request': prompted_video
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

