/*
 * libObserva global variables - available to all who link libObserva.js
 */
var animationDuration = 800;
var pluginState = 'none';
/* variables in snake_case are String constants for reuse in selectors*/
var local_video = '.local_video';
var remote_video = '.remote_video';
var plugin_content_area = '.plugin_content_area';
var broadcast_video = '.broadcast_video';
var plugin_content_element = "<video class='plugin_content_area'></video>";

/*
 * This function handles the actual playing of a piece of plugin content
 * and setting up its onended functions. Note that each onended destroys the plugin_content_area, so that a fresh one
 * can be made each time a plugin is called.
 * It takes in the video to add, the targetElement to add it to, and the pluginClass
 * that represents if it's a local video, a remote video, or a broadcast video
 */
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
    } else if (pluginClass === broadcast_video) {
        targetElement.src = video;
        targetElement.play(); //force it to play on the local side
        pluginState = 'broadcast';
        targetElement.onended = function (animationDuration) {
            $(plugin_content_area).hide(animationDuration);
            $(plugin_content_area).remove();
            $(broadcast_video).show(animationDuration);
            pluginState = 'none';
        };
    }
}


/*
 * This function handles a received piece of plugin content, adding it to the user interface
 * and signaling others to play it as well, if necessary.
 * This function is the one you would call from a client js file trying to implement the Observa client.
 * (See its use in static/call/caller.js and static/broadcast/broadcaster.js)
 */
function changeObservaVideoSource(video, target) {
    var pluginMsg;
    /* Always add a plugin content element, regardless of the end of the experience we're on. */
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
        /* Hide the remote stream, its being replaced with a plugin video */
        $(remote_video).hide(animationDuration);
        /* Make the plugin content area respect the rules of a remote video */
        $(plugin_content_area).toggleClass('remote_video');
        /* Animate in the plugin content area */
        $(local_video).css("width", "5%");
        $(plugin_content_area).show(animationDuration);

        /* setup the plugin content area now that it's been brought in: give the video src, begin playback */
        setupObservaPlugin(video, pluginArea, remote_video);

    } else if (target === 'broadcast') {
        $(broadcast_video).hide(animationDuration);
        $(plugin_content_area).show(animationDuration);
        setupObservaPlugin(video, pluginArea, broadcast_video);
        pluginMsg = {
            'userid': connection.userid,
            'message': 'plugin',
            'video': video
        };
        connection.sendCustomMessage(pluginMsg);
    }
}

/*
 * This function, given the side of the stream it is on, cleans up plugin content playback
 * and restores the user interface to the normal video call or video broadcast state.
 * This is the function you would call from a client js file trying to implement the Observa client.
 * (See static/call/caller.js and static/broadcast/broadcaster.js for example use)
 */
function endObservaPluginEarly(sideOfStream) {
    var pluginArea = $(plugin_content_area)[0];
    var endPluginRequest;
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
            endPluginRequest = {
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
        if (pluginState != 'none') {
            /* the pluginState is set to none when the broadcast client receives a stopearly message or when we send a stopearly message.*/
            endPluginRequest = {
                    message: 'stopearly'
                };
            connection.sendCustomMessage(endPluginRequest);
            pluginState = 'none';
        }
    }
}
