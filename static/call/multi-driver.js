var connection = new RTCMultiConnection().connect();
var onMessageCallbacks = {};
var socketio = io.connect('http://observa.nickpelone.com:1234/?channel=' + connection.channel);

socketio.on('message', function(data) {
    /* Don't process our own messages */
    if(data.sender == connection.userid) return;
   /* If a onMessageCallback exists for this channel (it had better!) */
    if (onMessageCallbacks[data.channel]) {
        /* call the callback function for this channel with the message we've received */
        onMessageCallbacks[data.channel](data.message);
    }
});
socketio.on('observaPluginResponse', function(obsRes) {
    console.log("Observa has sent a plugin response:");
    console.log(obsRes);

    if(obsRes.room === our_room) {
        /* handle plugin video */
    } else {
        return;
    }
});

/* Override RTCMultiConnection's provided signaling system.
 * We want control over our messages to allow the plugin architecture
 * to send out custom messages to change sources.
 */

connection.openSignalingChannel = function (config) {
    /* this is stuff set by RTCMultiConnection, we need to import it */
    var channel = config.channel || this.channel;
    onMessageCallbacks[channel] = config.onmessage;

    if (config.onopen) setTimeout(config.onopen, 1000);
    return {
        send: function (message) {
            socketio.emit('message', {
                sender: connection.userid,
                channel: channel,
                message: message
            });
        },
        channel: channel
    };
};

$("#start_button").click(function (event) {
    connection.open();
});
