<h1>Observa</h1>
<h4>0.1.1</h4>
A Node.js server and browser-side client for video sharing, calling, and broadcasting.

Observa provides a system for performing video calls and broadcasts over WebRTC, powered by RTCMultiConnection.

 
Observa allows clients to switch out their video output from one source to another. Video sources are provided by plugins. This allows someone to switch from their webcam feed to, say, a video on YouTube, and send out that video for everyone in the same call or broadcast to watch.

<h1>How to install:</h1>
Currently, Observa server is only supported on Unix-like platforms(Mac OS X, Linux, *BSD) whose filesystem follows the Unix convention(e.g. root is at ````/````). Support for Windows is planned for a future release. The impatient may consider editing the path of the ````plugin-depot```` in ````observa_modules/web_middleware/web.js```` to a Windows-compatible path, and removing root checks in ````app.js````.

1. Clone the repo
2. Run ````prepare-dependencies.sh```` to install the npm and bower dependencies into the project.
3. Run ````sudo node app.js```` or ````sudo npm start````. Observa server runs on port 80 and needs root to bind to this port. After binding, privileges are dropped and Observa server is run as a normal user.

<h1>How to Use:</h1>

1. In your browser, navigate to http://{hostname where an observa server is running}
2. Enter a channel name, and start a call or broadcast.
3. In either mode of operation, click the antenna button and allow access to your camera and microphone.
4. Share the link with your friends. People you share the link to only need to allow access to their camera and microphone(calls only, watching a broadcast requires no permissions.) - everything else is handled for them so long as someone has already hit the antenna button for that channel. For calls, its currently recommended to only have two participants.

<h1>How to Share a Video:</h1>

1. Click the plus button.
2. Select the service (plugin) you are requesting a video from.
3. Enter the video link and press 'OK'.
4. The video will playback on all ends of the stream. To end a video early, press the red 'X' button.

<h1> Browser Support </h1>
Observa uses WebRTC, a draft technology for real-time communication in the browser. As WebRTC is currently in draft status, varying implementations will have differences that are likely to break apps following the draft spec. Below is a table of browsers currently confirmed to work with Observa.

If you would like to make additions, please contact the developer or open a pull request to modify this file.

Browser | Should Work | Does Work
--------|-------------|----------
Google Chrome | <b>X</b> | <b>X</b> |
Mozilla Firefox | <b>X</b> | |
Opera | <b>?</b> | <b>?</b> |
Safari | | |
Internet Explorer | | |

<h1>Plugins</h1>
Currently, there is a functional reference YouTube plugin.

If you're interested in learning more, check out the <a href="https://github.com/nickpelone/observa/wiki/Observa-Plugin-Spec">Observa plugin spec</a>.

Observa is still missing:

1. A finalized plugin spec for 0.x releases (Targeted for <b>0.2</b>)
2. A plugin picker UI element. Right now the plus button auto-selects the YouTube plugin. (Targeted for <b>0.2</b>)

