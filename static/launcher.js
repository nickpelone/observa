(function () {
    var channel_desired = $("#channelName").val();
    $("#startCall").click(function (event) {
         window.location.href = "/call/incall-ui.html?call=" + channel_desired;
    });
    $("#startBroadcast").click(function (event) {
        window.location.href = "/broadcast/broadcaster-ui.html?broadcast=" + channel_desired;
    });
}());
