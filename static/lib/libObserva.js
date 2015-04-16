function changeObservaVideoSource(video, target) {
    var animationDuration = 800;
    var pluginArea = $("#plugin_content_area")[0];
    if (target === 'local') {
        $(".local_video").hide(animationDuration);
        $("#plugin_content_area").toggleClass('local_video');
        $("#plugin_content_area").show(animationDuration);

        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginArea.onended = function () {
            $("#plugin_content_area").hide(animationDuration);
            $(".local_video").show(animationDuration);

        };

        /* send the message to the other clients to load the video as well */
        var pluginMsg = {
            'message': 'plugin',
            'video': video
        };
        connection.sendCustomMessage(pluginMsg);
    } else if (target === 'remote') {
        $(".remote_video").hide(animationDuration);
        $("#plugin_content_area").show(animationDuration);
        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginArea.onended = function () {
            $("#plugin_content_area").hide(animationDuration);
            $(".remote_video").show(animationDuration);

        };

    } else if (target === 'broadcast') {
        $(".broadcast_video").hide(animationDuration);
        $("#plugin_content_area").show(animationDuration);
        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginArea.onended = function () {
            $("#plugin_content_area").hide(animationDuration);
            $(".broadcast_video").show(nimationDuration);

        };

    }
}
