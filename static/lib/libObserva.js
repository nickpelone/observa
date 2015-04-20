var animationDuration = 800;
var pluginState = 'none';
var local_video = '.local_video';
var remote_video = '.remote_video';
var plugin_content_area = '.plugin_content_area';
var broadcast_video = '.broadcast_video';
var plugin_content_element = "<video class='plugin_content_area'></video>";

function setupObservaPlugin(video, targetElement, pluginClass) {
    targetElement.src = video;
    targetElement.play(); //begin plugin playback

    if (pluginClass === local_video) {
        pluginState = 'local';
        targetElement.onended = function (animationDuration) {
            $(plugin_content_area).toggleClass('local_video');
            $(plugin_content_area).hide(animationDuration);
            $(local_video).show(animationDuration);
            pluginState = 'none';
            $(plugin_content_area).remove();
        };
    } else if (pluginClass === remote_video) {
        pluginState = 'remote';
        targetElement.onended = function (animationDuration) {
            $(plugin_content_area).toggleClass('remote_video'); //remove plugin content from the remote_video class before revealing remote_video
            $(plugin_content_area).hide(animationDuration);
            $(local_video).css("width", "30%");
            $(remote_video).show(animationDuration);
            pluginState = 'none';
            $(plugin_content_area).remove();
        };
    }
}



function changeObservaVideoSource(video, target) {
    var pluginMsg;
    $("#video_container").prepend(plugin_content_element);
    var pluginArea = $(plugin_content_area)[0];
    if (target === 'local') {
        /* First hide the local video stream from the client interface */
        $(local_video).hide(animationDuration);
        /* Now give the plugin content area the rules of a local video, as we have sent the video */
        $(plugin_content_area).toggleClass('local_video');
        /* Now animate the plugin content area into visibility */
        $(plugin_content_area).show(animationDuration);

        /* setup the plugin content area, including beginning video playback */
        setupObservaPlugin(video, pluginArea, local_video);

        /* send the message to the other clients to load the video as well */
        pluginMsg = {
            'message': 'plugin',
            'video': video
        };
        connection.sendCustomMessage(pluginMsg);
    } else if (target === 'remote') {

        $("#video_container").prepend(plugin_content_element);
        $(remote_video).hide(animationDuration);
        $(plugin_content_area).toggleClass('remote_video'); //constrain the plugin content to remote_video rules
        $(plugin_content_area).show(animationDuration);
        $(local_video).css("width", "5%");

        setupObservaPlugin(video, pluginArea, remote_video);

    } else if (target === 'broadcast') {
        $("#video_container").prepend(plugin_content_element);
        $(broadcast_video).hide(animationDuration);
        $(plugin_content_area).show(animationDuration);
        pluginArea.sr = video;
        pluginArea.play(); //force it to play on the local side
        pluginState = 'broadcast';
        pluginArea.onended = function () {
            $(plugin_content_area).hide(animationDuration);
            $(plugin_content_area).remove();
            $(broadcast_video).show(animationDuration);
            pluginState = 'none';
        };
        if (pluginState === 'none') {
            pluginMsg = {
                'message': 'plugin',
                'video': video
            };
            connection.sendCustomMessage(pluginMsg);
        }
    }
}

function endObservaPluginEarly(sideOfStream) {
    var pluginArea = $(plugin_content_area)[0];
    if (sideOfStream === 'local') {
        /*
         * We are ending the stream on the local side.
         * We will stop the video here, cleanup and hide the plugin content area,
         * bring back our local video, and then tell other clients to end.
         */
        if (pluginState === 'local') {
            pluginArea.pause();
            pluginArea.src = "";
            $(plugin_content_area).hide(animationDuration);
            $(plugin_content_area).toggleClass('local_video');
            $(plugin_content_area).remove();
            //plugin content has been hidden and removed from the local_video class
            $(local_video).show(animationDuration);

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
            $(plugin_content_area).hide(animationDuration);
            $(plugin_content_area).css("display", "none");
            $(plugin_content_area).remove();
            $(local_video).css("width", "30%");
            $(remote_video).show(animationDuration);
            pluginState = 'none';
        }
    } else if (sideOfStream === 'broadcast') {
        /*
         * Remove the plugin content area, show the broadcast video again
         */

        $(plugin_content_area).hide(animationDuration);
        $(plugin_content_area).css("display", "none");
        $(plugin_content_area).remove();
        $(broadcast_video).show(animationDuration);
        pluginState = 'none';
    }
}
