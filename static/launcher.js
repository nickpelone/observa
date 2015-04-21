(function () {
    $(document).ready(function () {
        /* click handlers for the launcher page */
        $("#startCall").click(function (event) {
            var channel_desired = $("#channelName").val();
            if (channel_desired === null || channel_desired === '' || channel_desired === undefined) {
                alert("You have to put in a channel name before starting!");
                return;
            }
            window.location.href = "/call/incall-ui.html?call=" + channel_desired;
        });
        $("#startBroadcast").click(function (event) {
            var channel_desired = $("#channelName").val();
            if (channel_desired === null || channel_desired === '' || channel_desired === undefined) {
                alert("You have to put in a channel name before starting!");
                return;
            }
            window.location.href = "/broadcast/broadcaster-ui.html?broadcast=" + channel_desired;
        });
    });
}());
