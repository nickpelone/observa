var connection = new RTCMultiConnection().connect();
connection.onCustomMessage = function (message) {
    console.log("received a custom message: " + message);
};

$("#start_button").click(function (event) {
    connection.open();
});

$("#end_button").click(function (event) {
    connection.sendCustomMessage("hello, world");
});

$("#plugin_button").click(function (event) {
    var pluginRequest = {
        'plugin': 'youtube',
        'request': 'https://www.youtube.com/watch?v=rjQtzV9IZ0Q'
    };
    $.post("/plugin-handler", pluginRequest, function (data) {
        console.log(data);
    });
});

