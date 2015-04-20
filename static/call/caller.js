var connection = new RTCMultiConnection().connect();

$(document).ready(function () {
    /* Set the default states of the buttons */
    $("#plugin_button")[0].disabled = true;
    $("#end_button")[0].disabled = true;

    /* FIX for mobile where local video appears perpetually paused after it is added */
    setInterval(function () {
        try {
            $(".local_video")[0].play();
            $(".remote_video")[0].play();
        } catch (error) {
        }
    }, 1000);


    window.onbeforeunload = function () {
        if (pluginState === 'local') {
            endObservaPluginEarly('local');
        } else if (pluginState === 'remote') {
            endObservaPluginEarly('remote');
        }
    };

    $("#start_button").click(function (event) {
        connection.open();
        $("#plugin_button")[0].disabled = false;
        $("#end_button")[0].disabled = false;
        $("#start_button")[0].disabled = true;
    });

    $("#end_button").click(function (event) {
        endObservaPluginEarly('local');
    });

    connection.onNewSession = function (session) {
        $("#plugin_button")[0].disabled = false;
        $("#end_button")[0].disabled = false;
        $("#start_button")[0].disabled = true;
        session.join();
    };


    connection.onCustomMessage = function (message) {
        console.log("received a custom message: " + message);
        if (message.message === 'plugin') {
            /* received a video from another client to play */
            changeObservaVideoSource(message.video, 'remote');
        } else if (message.message === 'stopearly') {
            // the remote plugin is hanging up - clean up and restore the normal remote video!
            endObservaPluginEarly('remote');
        }
    };
    $("#plugin_button").click(function (event) {
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
                changeObservaVideoSource(data.video, 'local');
            }
        });
    });
});