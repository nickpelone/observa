(function () {
        var connection = new RTCMultiConnection().connect();

        connection.session = {
            audio: true,
            video: true,
            oneway: true
        };

        var sessions = {};
        connection.onNewSession = function (session) {
            console.log("Session found!, attempting to join");
            connection.dontCaptureUserMedia = true;
            session.join({
                oneway: true
            });
            $("#start_button")[0].disabled = true;
            $("#plugin_button")[0].disabled = true;
        };

        connection.onstream = function (e) {
            e.mediaElement.className = e.mediaElement.className + 'broadcast_video';
            $("#video_container").append(e.mediaElement);
        };
        connection.userid = (Math.floor(Math.random() * 1000));
        connection.connect(); //signaling

        $("#start_button").click(function (event) {
            this.disabled = true;
            connection.open(); //open video/audio
            connection.sendCustomMessage({
                broadcast: true
            });


        });

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
                    changeObservaVideoSource(data.video, 'broadcast');
                }
            });
        });

        connection.onCustomMessage = function (message) {
            console.log("Received a custom message: %j", message);
            if (message.broadcast === true) {
                //connection.askToShareParticipants();

                connection.dontCaptureUserMedia = false;
                connection.addStream({
                    audio: true,
                    video: true
                });
                console.log("Opening a received broadcast?");
            } else if (message.message === 'plugin') {
                /* received a video from another client to play */
                changeObservaVideoSource(message.video, 'broadcast');
            } else if (message.message === 'stopearly') {
                // the remote plugin is hanging up - clean up and restore the normal remote video!
                endObservaPluginEarly('broadcast');
            }
        };
})();
