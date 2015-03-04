(function () {
    "use strict";
    // cross browser compat shim
    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    console.log("Hello world!");

    var videoConstaints = {video: true};

    function onMediaOpen(localMediaStream) {
        window.stream = localMediaStream;
        var video = $("#basic_webrtc_demo_video")[0];
        video.src = window.URL.createObjectURL(localMediaStream);
        video.play(); // start playback
    }

    function onMediaError(error) {
        console.log("navigator.getUserMedia error: " + error);
    }

    function playPause(video_element) {
        if (video_element.paused) {
            video_element.play();
        } else {
            video_element.pause();
        }
    }


    //grab the user media object and pass it to onMediaOpen
    $("#start_demo_one").click(function () {
        navigator.getUserMedia(videoConstaints, onMediaOpen, onMediaError);
    });

    $("#start_demo_two").click(function () {
        var video = $("#basic_webrtc_demo_video")[0];
        var newVideoSource = "http://atv-demo.nickpelone.com/yt/keyboard-cat.mp4";
        video.src = newVideoSource;
        video.play();
    });
    $("#pause_play_button").click(function () {
        var video = $("#basic_webrtc_demo_video")[0];
        playPause(video);
    });
}());
