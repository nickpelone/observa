function changeObservaVideoSource(video, target) {
    var animationDuration = 800;
    var pluginArea = $("#plugin_content_area")[0];
    if (target === 'local') {
        $(".local_video").toggle(animationDuration);
        $("#plugin_content_area").toggleClass('local_video'); //ensure the plugin area fades in with the appearance of a local video
        $("#plugin_content_area").toggle(animationDuration);

        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginArea.onended = function () {
            $("#plugin_content_area").toggleClass('local_video'); //ensure we remove local video properties from the plugin area
            $("#plugin_content_area").toggle(animationDuration);
            $(".local_video").toggle(animationDuration);

        };

        /* send the message to the other clients to load the video as well */
        var pluginMsg = {
            'message': 'plugin',
            'video': video
        };
        connection.sendCustomMessage(pluginMsg);
    } else if (target === 'remote') {
        $(".remote_video").toggle(animationDuration);
        $("#plugin_content_area").toggle(animationDuration);
        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginArea.onended = function () {
            $(".remote_video").toggle(animationDuration);
            $("#plugin_content_area").toggle(animationDuration);
        };

    } else if (target === 'broadcast') {
        $(".broadcast_video").toggle(animationDuration);
        $("#plugin_content_area").toggle(animationDuration);
        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginArea.onended = function () {
            $(".broadcast_video").toggle(animationDuration);
            $("#plugin_content_area").toggle(animationDuration);
        };

    }
}
