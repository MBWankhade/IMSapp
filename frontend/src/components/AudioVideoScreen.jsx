import React, { useContext, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { DataContext } from '../context/DataProvider';
import Notepad from './Notepad';
import CodeEditor from './CodeEditor';

function AudioVideoScreen() {
  const { roomId, peerInstance, status } = useContext(DataContext);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);

  useEffect(() => {
    const getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    if (!peerInstance.current) {
      peerInstance.current = new Peer(); // Initialize Peer instance if not already initialized
    }

    peerInstance.current.on('call', (call) => {
      getUserMedia({ video: true, audio: true })
        .then(mediaStream => {
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();

          call.answer(mediaStream);

          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          });
        })
        .catch(err => {
          console.error('Failed to get local stream', err);
        });
    });

    if (status === "interviewee") {
      call(roomId);
    }

    return () => {
      // Clean up Peer instance and any active connections
      if (peerInstance.current) {
        peerInstance.current.destroy();
        peerInstance.current = null;
      }
    };
  }, [roomId, status]);

  const call = (remotePeerId) => {
    const getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true })
      .then(mediaStream => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();

        const call = peerInstance.current.call(remotePeerId, mediaStream);

        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      })
      .catch(err => {
        console.error('Failed to get local stream', err);
      });
  };

  return (
    <>
    <div className="flex w-full justify-between h-2/6 items-center px-12">
      <div className='w-4/12 '>
        <video ref={currentUserVideoRef} autoPlay playsInline className='rounded-xl shadow-xl'  />
      </div>
      <Notepad />
      <div className='w-4/12 '>
        <video ref={remoteVideoRef} autoPlay playsInline className='rounded-xl shadow-xl'  />
      </div>
    </div>
    <div>
      <CodeEditor />
    </div>
    </>
  );
}

export default AudioVideoScreen;
