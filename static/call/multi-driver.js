var connection = new RTCMultiConnection().connect();

$("#start_button").click(function (event) {
    connection.open();
});

$("#end_button").click(function (event) {
    connection.sendCustomMessage("hello, world");
});

$("#plugin_button").click(function (event) {
    var prompted_video = prompt("Please enter a YouTube video URL.", '');
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

