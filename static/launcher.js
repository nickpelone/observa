(function () {

    $("#startCall").click(function (event) {
        var channel_desired = $("#channelName").val();
         window.location.href = "/call/incall-ui.html?call=" + channel_desired;
    });
    $("#startBroadcast").click(function (event) {
        var channel_desired = $("#channelName").val();
        window.location.href = "/broadcast/broadcaster-ui.html?broadcast=" + channel_desired;
    });
}());
