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

