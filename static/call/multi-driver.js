var connection = new RTCMultiConnection().connect();
document.querySelector('#openNewSessionButton').onclick = function() {
    connection.open();
};
