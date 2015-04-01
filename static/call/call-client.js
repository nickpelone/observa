(function () {
    "use strict";
    console.log("call-client.js loaded");

    //declarations
    //
    var socket = new io.Socket();
    socket.connect("" + document.URL + ":1234");

    var localVideoStream, localPeerConnection, remotePeerConnection;

    var localVideoElement = $("#local_video")[0];
    var remoteVideoElement = $("#remote_video")[0];

    var startButton = $("#start_button")[0];
    var callButton = $("#call_button")[0];
    var endButton = $("#end_button")[0];

    //peer connection options
    var pc_config = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};

var pc_constraints = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

    function successCallback(videoStream) {
        console.log("successCallback() was called");
        localVideoElement.src = URL.createObjectURL(videoStream);
        localVideoStream = videoStream;
        callButton.disabled = false;
    }

    function errorCallback(error) {
        console.log(error);
    }

    function startup() {
        console.log("startup() was called");
        console.log("Requesting local video stream...");
        startButton.disabled = true;
        var constraints = {
            audio: true,
            video: true
        };

        navigator.getUserMedia(constraints, successCallback, errorCallback);
    }

    function startCall() {
        console.log("startCall() was called");
        callButton.disabled = true;
        endButton.disabled = false;

        if (localVideoStream.getVideoTracks().length > 0) {
            // if there are available local video tracks
            console.log("using video device: " + localVideoStream.getVideoTracks()[0].label);
        }
        if (localVideoStream.getAudioTracks().length > 0) {
            //if there are available local audio tracks
            //TODO: allow user to pick their own
            console.log("Using audio device: " + localVideoStream.getAudioTracks()[0].label);
        }

        var observaServers = null;
        localPeerConnection = new RTCPeerConnection(observaServers);
        console.log("Created local peer connection object localPeerConnection");
        localPeerConnection.onicecandidate = gotLocalIceCandidate;

        remotePeerConnection = new RTCPeerConnection(observaServers);
        console.log("Created remote peer connection object remotePeerConnection");
        remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
        remotePeerConnection.onaddstream = gotRemoteStream;

        localPeerConnection.addStream(localVideoStream);
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

    function gotRemoteStream(event) {
        remoteVideoElement.src = URL.createObjectURL(event.stream);
        console.log("Received remote WebRTC stream");
    }

    function gotLocalIceCandidate(event) {
        if (event.candidate) {
            remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
            console.log("Got a local ICE candidate: \n" + event.candidate.candidate);
        }
    }

    function gotRemoteIceCandidate(event) {
        if (event.candidate) {
            localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
            console.log("Got a remote ICE candidate: \n" + event.candidate.candidate);
        }
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
