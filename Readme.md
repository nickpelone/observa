<h1>Observa</h1>
A Node.js server and browser-side client for video sharing, calling, and broadcasting.

Observa provides a system for performing video calls and broadcasts over WebRTC, powered by RTCMultiConnection.

 
Observa allows clients to switch out their video output from one source to another. Video sources are provided by plugins. This allows someone to switch from their webcam feed to, say, a video on YouTube, and send out that video for everyone in the same call or broadcast to watch.

<h1>How to install:</h1>
Currently, Observa server is only supported on Unix-like platforms whose filesystem follows the Unix convention(e.g. root is at '/'). Support for Windows is planned for a future release.

1. Clone the repo
2. Run "prepare-dependencies.sh" to install the npm and bower dependencies into the project.
3. Run "sudo node app.js" or "sudo npm start". Observa server runs on port 80 and needs root to bind to this port. After binding, privileges are dropped and Observa server is run as a normal user.

<h1>How to Use:</h1>

1. In your browser, navigate to http://{wherever observa is installed}
2. Enter a channel name, and start a call or broadcast.
3. In either mode of operation, click the antenna button and allow access to your camera and microphone.
4. Share the link with your friends. For calls, its currently recommended to only have two participants.

<h1>How to Share a Video:</h1>

1. Click the plus button.
2. Select the service (plugin) you are requesting a video from.
3. Enter the video link and press 'OK'.
4. The video will playback on all ends of the stream. To end a video early, press the red 'X' button.