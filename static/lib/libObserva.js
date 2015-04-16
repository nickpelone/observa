function changeObservaVideoSource(video, target) {
    var pluginArea = $("#plugin_content_area")[0];
    if (target === 'local') {
        $(".local_video").hide();
        $("#plugin_content_area").show();
        $("#plugin_content_area").toggleClass('local_video');
        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginArea.onended = function () {
            $(".local_video").show();
            $("#plugin_content_area").hide();
        };

        /* send the message to the other clients to load the video as well */
        var pluginMsg = {
            'message': 'plugin',
            'video': video
        };
        connection.sendCustomMessage(pluginMsg);
    } else if (target === 'remote') {
        $(".remote_video").hide();
        $("#plugin_content_area").show();
        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginArea.onended = function () {
            $(".remote_video").show();
            $("#plugin_content_area").hide();
        };

    } else if (target === 'broadcast') {
        $(".broadcast_video").hide();
        $("#plugin_content_area").show();
        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginArea.onended = function () {
            $(".broadcast_video").show();
            $("#plugin_content_area").hide();
        };

    }
}
