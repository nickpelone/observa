/* We're a library, we *want* to add to global namespace, so no IIFE */
var socket = io.connect('observa.nickpelone.com:1234');


//flag variables
var isCallReady;
var isCaller;
var isStarted = false;
var turnReady;

//peer connection options, use google STUN for NAT traversal
//todo: auto-magically specify TURN as well
var pcConfig = {
    'iceServers': [{
        'url': 'stun:stun.l.google.com:19302'
        }]
};

//peer connection constraints
var pcConstraints = {
    'optional': [{
        'DtlsSrtpKeyAgreement': true
        }]
};

//user media constraints
var userMediaConstraints = {
    video: true,
    audio: true
};

//sdp options - mandate that clients at least receive audio / video
var sdpConstraints = {
    'mandatory': {
        'OfferToReceiveAudio': true,
        'OfferToReceiveVideo': true
    }
    //set default i
};

/* socket stuff */
function sendObservaSocketMsg(message) {
    console.log("Client application is sending message: " + message + " to Observa server");
    socket.emit('message', message);
}

socket.on('hello', function (data) {
    console.log("received a hello from socket.io");
});

socket.on('message', function (message) {
    if (message === 'got user media') {
        // server reports 'got user media'
        conditionalStartCall();
    } else if (message.type === 'offer') {
        if (!isCaller && !isStarted) {
            conditionalStartCall();
        }
        peerConnection.setRemoteDescription(new RTCSessionDescription(message));
        answerObservaCall();
    } else if (message.type === 'answer' && isStarted) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(message));
    } else if (message.type === 'candidate' && isStarted) {

        var candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
        });
        peerConnection.addIceCandidate(candidate);
    } else if (message === 'bye') {
        handleRemoteHangup();
    }
});
//set default i

socket.on('created', function (room) {
    console.log('Created room ' + room);
    isCaller = true;
});

socket.on('full', function (room) {
    console.log('Room ' + room + ' is full');
});

socket.on('join', function (room) {
    console.log('Another peer made a request to join room ' + room);
    console.log('This peer is the initiator of room ' + room + '!');
    isCallReady = true;
});

socket.on('joined', function (room) {
    console.log('This peer has joined room ' + room);
    isCallReady = true;
});

socket.on('log', function (array) {
    console.log.apply(console, array);
});

/* observa client call functions */
function handleUserMedia(stream) {
    console.log("Getting local video stream...");
    var localVideoElement = $("#local_video")[0];
    localVideoElement.src = URL.createObjectURL(stream);
    localStream = stream;
    sendObservaSocketMsg('got user media');
    if (isCaller) {
        conditionalStartCall();
    }
}

function genericErrorHandler(error) {
    console.log("ERROR in Observa Client: " + error);
}

if (location.hostname != 'localhost') {
    //we need a TURN server as well as a STUN server
    //this request URL is taken from a bitbucket codelab,
    //located at https://bitbucket.org/webrtc/codelab/src/c75c8e837a125441d2ee008c55348ac5a24a85d4/complete/step6/js/main.js?at=master
    //it requests a TURN from Google
    //todo: investigate feasability of coupling TURN server with observa distributions
    requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');
}

function conditionalStartCall() {
    if (!isStarted && typeof localStream != 'undefined' && isCallReady) {
        //if we havent started, the local stream is defined, and if the channel is ready
        console.log("conditionalStartCall()");
        createObservaPeerConnection();
        peerConnection.addStream(localStream);

        isStarted = true;

        console.log('Client is Caller: ', isCaller);
        if (isCaller) {
            startObservaCall();
        }
    }
}

function createObservaPeerConnection() {
    try {
        peerConnection = new RTCPeerConnection(null);
        peerConnection.onicecandidate = handleIceCandidate;
        peerConnection.onaddstream = handleRemoteStreamAdded;
        peerConnection.onremovestream = handleRemoteStreamRemoved;
        console.log('Created RTCPeerConnection for this Observa call');
    } catch (error) {
        console.log("Error during RTCPeerConnection creation.");
        genericErrorHandler(error);
    }
}

function handleIceCandidate(event) {
    console.log('handleIceCandidate: event: ' + event);
    if (event.candidate) {
        sendObservaSocketMsg({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
        });
    } else {
        console.log("End of ICE candidates");
    }
}

function handelRemoteStreamAdded(event) {
    console.log("Remote stream added!");
    var remoteVideoElement = $("#remote_video")[0];
    remoteVideoElement.src = URL.createObjectURL(event.stream);
    remoteStream = event.stream;
}

function startObservaCall() {
    console.log("Sending call offer to connected peer");
    peerConnection.createOffer(setLocalAndSendMsg, genericErrorHandler, pcConstraints);
}

function answerObservaCall() {
    console.log("Sending call answer to connected peer");
    peerConnection.createAnswer(setLocalAndSendMsg, genericErrorHandler, pcConstraints);
}

function setLocalAndSendMsg(sessionDesc) {
    //TODO: set preferred codecs (opus)
    peerConnection.setLocalDescription(sessionDesc);
    peerConnection.addStream(remoteStream);
    console.log("setLocalAndSednMsg: set local descrption, now sending");
    sendObservaSocketMsg(sessionDesc);
}

function requestTurn(turnURL) {
    console.log("No TURN servers have been set up, getting one from compute engine!");
    $.getJSON("https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913&callback=?", function (data) {
        var turnServers = JSON.parse(data.responseData);
        log("Got TURN server! %j", turnServers);
        peerConnection.iceServers.push({
            'url': 'turn:' + turnServers.username + '@' + turnServers.turn,
            'credential': turnServer.password
        });
        turnReady = true;
    });
}

function handleRemoteStreamAdded(event) {
    console.log("Remote client stream added!");
    var remoteVideoElement = $("#remote_video")[0];
    remoteVideoElement.src = URL.createObjectURL(event.stream);
}

function handleRemoteStreamRemoved(event) {
    console.log("Remote client stream removed! " + event);
    $(body).append("<h1>remote has hungup</h1>");
}

function hangup() {
    console.log("Hanging up.");
    stopObservaCall();
    sendObservaSocketMsg('bye');
}

function stopObservaCall() {
    isStarted = false;
    peerConnection.close();
    peerConnection = null;
}


/* tell the socket bye before the DOM is destroyed (page close) */
window.onbeforeunload = function (event) {
    sendObservaSocketMsg('bye');
};
