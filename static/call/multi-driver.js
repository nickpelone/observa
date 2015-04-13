var connection = new RTCMultiConnection().connect();
$("#start_button").click(function (event) {
    connection.open();
});
