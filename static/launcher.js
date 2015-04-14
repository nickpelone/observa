(function () {

    $("#startCall").click(function (event) {
         var channel_desired = $("#channelName").val();
         window.location.href = "/call/incall-ui.html?call=" + channel_desired;
    });
    $("#startBroadcast").click(function (event) {
        alert("This isn't implemented yet!");
    });
}());
