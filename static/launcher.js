(function () {

    $("#startCall").click(function (event) {
         var channel_desired = $("#channelName").val;
         window.location.href = "/call/incall-ui.html?call=" + channel_desired;
    });
}());
