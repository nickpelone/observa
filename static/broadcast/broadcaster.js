var connection = new RTCMultiConnection().connect();
$(document).ready(function () {
    /* Set the inital state of the user interface */
    $("#plugin_button")[0].disabled = true;
    $("#end_button")[0].disabled = true;

    /*
     * RTCMultiConnection Overrides
     */

    /* setup the conditions for this session, namely, the one-way property */
    connection.session = {
        audio: true,
        video: true,
        oneway: true
    };

    /* set a random userid */
    connection.userid = (Math.floor(Math.random() * 1000));
    /* open the connection to the signaling server */
    connection.connect(); //signaling


    /* override onstream to insert extra classes on the video element before its inserted to the DOM */
    connection.onstream = function (e) {
        e.mediaElement.className = e.mediaElement.className + ' broadcast_video';
        $("#video_container").append(e.mediaElement);
    };



    var sessions = {}; //holdover from example RTCMultiConnection code, this is likely no longer needed
    /* override onNewSession to join into sessions in one-way mode */
    connection.onNewSession = function (session) {
        /* set up the conditions for a one-way viewing of the video stream */
        connection.dontCaptureUserMedia = true;
        session.join({
            oneway: true
        });
        $("#start_button")[0].disabled = true;
        $("#plugin_button")[0].disabled = true;
        $("#end_button")[0].disabled = true;
    };

    /* override onCustomMessage to implement plugin functionality and receive broadcast notifications */
     connection.onCustomMessage = function (message) {
        console.log("Received a custom message: %j", message);
        if (message.broadcast === true) {

            connection.dontCaptureUserMedia = false;
            connection.addStream({
                audio: true,
                video: true
            });

        } else if (message.message === 'plugin') {
            /* received a video from another client to play */
            /* check to see if a video is already playing */
            if ($(".plugin_content_area").size() === 0) {
                changeObservaVideoSource(message.video, 'broadcast');
            }
        } else if (message.message === 'stopearly') {
            // the remote plugin is hanging up - clean up and restore the normal remote video!
            pluginState = 'none';
            endObservaPluginEarly('broadcast');
        }
    };

    /*
     * Click handlers
     */

    $("#start_button").click(function (event) {
        this.disabled = true;
        connection.open(); //open video/audio
        connection.sendCustomMessage({
            broadcast: true
        });
        $("#plugin_button")[0].disabled = false;
        $("#end_button")[0].disabled = false;
    });

    $("#plugin_button").click(function (event) {
        connection.sendCustomMessage("hello???");
        var prompted_video = prompt("Please enter a YouTube video URL.", '');
        if (prompted_video === null) return; //don't break because someone canceled their plugin request
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
            success: function (data) {
                console.log("Successfully posted");
                console.log(data);
                if (data.error) return;
                changeObservaVideoSource(data.video, 'broadcast');
            }
        });
    });

    $("#end_button").click(function (event) {
        endObservaPluginEarly('broadcast');
    });

});
