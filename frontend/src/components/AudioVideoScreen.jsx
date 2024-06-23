import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

function AudioVideoScreen() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const screenRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream);
        call.on('stream', function(remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      }, (err) => {
        console.error('Failed to get local stream', err);
      });
    });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });

      const screenShare = async () => {
        try {
          const captureStream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: "screen" }
          });
          
          // Instead of calling peerInstance.call directly, use the established call to replace the tracks
          const sender = call.peerConnection.getSenders().find(s => s.track.kind === captureStream.getVideoTracks()[0].kind);
          if (sender) {
            sender.replaceTrack(captureStream.getVideoTracks()[0]);
          }

          screenRef.current.srcObject = captureStream;
          screenRef.current.play();
        } catch (err) {
          console.error('Failed to share screen', err);
        }
      };

      screenShare();
    }, (err) => {
      console.error('Failed to get local stream', err);
    });
  };

  return (
    <div className="App">
      <h1>Current user id is {peerId}</h1>
      <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <div>
        <video ref={currentUserVideoRef} autoPlay playsInline />
      </div>
      <div>
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <div>
        <div>screen share</div>
        <video ref={screenRef} autoPlay playsInline />
      </div>
    </div>
  );
}

export default AudioVideoScreen;
