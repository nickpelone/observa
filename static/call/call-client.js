(function () {
    "use strict";
    console.log("call-client.js loaded");

    //declarations
    //

    var localVideoStream, localPeerConnection, remotePeerConnection;

    var localVideoElement = $("#local_video")[0];
    var remoteVideoElement = $("#remote_video")[0];

    var startButton = $("#start_button")[0];
    var callButton = $("#call_button")[0];
    var endButton = $("#end_button")[0];

    function successCallback(videoStream) {
        console.log("successCallback() was called");
    }

    function errorCallback(error) {
        console.log(error);
    }

    function startup() {
        console.log("startup() was called");
        console.log("Requesting local video stream...");
        startButton.disabled = true;
        var constraints = {};

        getUserMedia(constraints, successCallback, function (error) {
            console.log("error: " + error);
        });
    }

    function startCall() {
        console.log("startCall() was called");
        callButton.disabled = true;
        hangupButton.disabled = false;

        if (localVideoStream.getVideoTracks().length > 0) {
            // if there are available local video tracks
            console.log("using video device: " + localVideoStream.getVideoTracks()[0].label);
        }
        if (localVideoStream.getAudioTracks().length > 0) {
            //if there are available local audio tracks
            //TODO: allow user to pick their own
            console.log("Using audio device: " + localVideoStream.getVideoTracks[0].label);
        }

        var observaServers = null;
        localPeerConnection = new RTCPeerConnection(servers);
        console.log("Created local peer connection object localPeerConnection");
        localPeerConnection.onicecandidate = gotLocalIceCandidate;

        remotePeerConnection = new RTCPeerConnection(servers);
        console.log("Created remote peer connection object remotePeerConnection");
        remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
        remotePeerConnection.onaddstream = gotRemoteStream;

        localPeerConnection.addStream(localStream);
        console.log("Added localStream to localPeerConnection");
        localPeerConnection.createOffer(gotLocalDescription, errorCallback);

    }

    function gotLocalDescription(description) {
        localPeerConnection.setLocalDescription(description);
        console.log("Received Offer from localPeerConnection: \n" + description.sdp);
        remotePeerConnection.setRemoteDescription(description);
        remotePeerConnection.createAnswer(gotRemoteDescription, errorCallback);
    }

    function gotRemoteDescription(description) {
        remotePeerConnection.setLocalDescription(description);
        console.log("Answer from remotePeerConnection: \n" + description.sdp);
        localPeerConnection.setRemoteDescription(description);
    }

    function end() {
        console.log("end() was called");
        localPeerConnection.close();
        remotePeerConnection.close();
        localPeerConnection = null;
        remotePeerConnection = null;
        endButton.disabled = true;
        callButton.disabled = false;
    }



    //set default interface states

    startButton.disabled = false;
    callButton.disabled = true;
    endButton.disabled = true;

    // click handlers
    $("#start_button").click(startup);
    $("#call_button").click(startCall);
    $("#end_button").click(end);



})();
