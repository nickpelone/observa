var animationDuration = 800;
var pluginState = 'none';

function changeObservaVideoSource(video, target) {
    $("#video_container").prepend("<video class='plugin_content_area'></video>");
    var pluginArea = $(".plugin_content_area")[0];
    if (target === 'local') {
        $(".local_video").hide(animationDuration);
        $(".plugin_content_area").toggleClass('local_video'); //ensure the plugin area fades in with the appearance of a local video
        $(".plugin_content_area").show(animationDuration);

        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginState = 'local';
        pluginArea.onended = function () {
            $(".plugin_content_area").toggleClass('local_video'); //ensure we remove local video properties from the plugin area
            $(".plugin_content_area").hide(animationDuration);
            $(".local_video").show(animationDuration);
            pluginState = 'none';
            $(".plugin_content_area").remove();

        };

        /* send the message to the other clients to load the video as well */
        var pluginMsg = {
            'message': 'plugin',
            'video': video
        };
        connection.sendCustomMessage(pluginMsg);
    } else if (target === 'remote') {
        $("#video_container").prepend("<video class='plugin_content_area'></video>");
        $(".remote_video").hide(animationDuration);
        $(".plugin_content_area").toggleClass('remote_video'); //constrain the plugin content to remote_video rules
        $(".plugin_content_area").show(animationDuration);
        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginState = 'remote';
        pluginArea.onended = function () {
            $(".plugin_content_area").toggleClass('remote_video'); //remove plugin content from the remote_video class before revealing remote_video
            $(".plugin_content_area").hide(animationDuration);
            $(".remote_video").show(animationDuration);
            pluginState = 'none';
            $(".plugin_content_area").remove();
        };

    } else if (target === 'broadcast') {
        $("#video_container").prepend("<video class='plugin_content_area'></video>");
        $(".broadcast_video").hide(animationDuration);
        $(".plugin_content_area").show(animationDuration);
        pluginArea.src = video;
        pluginArea.play(); //force it to play on the local side
        pluginState = 'broadcast';
        pluginArea.onended = function () {
            $(".plugin_content_area").hide(animationDuration);
            $(".plugin_content_area").remove();
            $(".broadcast_video").show(animationDuration);
        };
        var pluginMsg = {
            'message': 'plugin',
            'video': video
        };
        connection.sendCustomMessage(pluginMsg);
    }
}

function endObservaPluginEarly(sideOfStream) {
    var pluginArea = $(".plugin_content_area")[0];
    if (sideOfStream === 'local') {
        /*
         * We are ending the stream on the local side.
         * We will stop the video here, cleanup and hide the plugin content area,
         * bring back our local video, and then tell other clients to end.
         */
        if (pluginState === 'local') {
            pluginArea.pause();
            pluginArea.src = "";
            $(".plugin_content_area").hide(animationDuration);
            $(".plugin_content_area").toggleClass('local_video');
            $(".plugin_content_area").remove();
            //plugin content has been hidden and removed from the local_video class
            $(".local_video").show(animationDuration);

            //We now need to tell the remote client that it's time to end the video
            var endPluginRequest = {
                message: 'stopearly'
            };
            connection.sendCustomMessage(endPluginRequest);
            pluginState = 'none';
        }
    } else if (sideOfStream === 'remote') {
        /*
         * We have been asked to hang up the plugin content that has come from the remote.
         * We will stop the plguin content area video, cleanup and hide it, and restore the remote's video
         *
         */
        if (pluginState === 'remote') {
            pluginArea.pause();
            pluginArea.src = "";
            $(".plugin_content_area").hide(animationDuration);
            $(".plugin_content_area").css("display", "none");
            $(".plugin_content_area").remove();
            $(".remote_video").show(animationDuration);
            pluginState = 'none';
        }
    } else if (sideOfStream === 'broadcast') {
        /*
         * Remove the plugin content area, show the broadcast video again
         */

        $(".plugin_content_area").hide(animationDuration);
        $(".plugin_content_area").css("display", "none");
        $(".plugin_content_area").remove();
        $(".broadcast_video").show(animationDuration);
        pluginState = 'none';
    }
}
