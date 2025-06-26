import React, { useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import Chat from '../components/Chat';

// own 
  const APP_ID = 'f6bdee12e56b4587a5b3dec906141766';
  const CHANNEL = 'hell cast';
  const TOKEN = "007eJxTYLBgWzL9eEfJFsNz0t3+jJsc5ifrfgz3nurG+nz7rATJ9ZkKDGlmSSmpqYZGqaZmSSamFuaJpknGKanJlgZmhiaG5mZm4oqBGQ2BjAxCcldYGRkgEMTnZMhIzclRSE4sLmFgAABSJB5m";



export default function View() {
  const remotePlayerRef = useRef(null);
  const clientRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      // Join the same channel
      await clientRef.current.join(APP_ID, CHANNEL, TOKEN, null);

      // Subscribe to remote users when they publish tracks
      clientRef.current.on('user-published', async (user, mediaType) => {
        await clientRef.current.subscribe(user, mediaType);
        console.log('Subscribed to user:', user.uid);

        if (mediaType === 'video') {
          const remoteVideoTrack = user.videoTrack;
          remoteVideoTrack.play(remotePlayerRef.current);
        }

        if (mediaType === 'audio') {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack.play(); // audio doesn't need a DOM element
        }
      });

      // Cleanup on unmount
      return () => {
        if (clientRef.current) {
          clientRef.current.leave();
        }
      };
    };

    init();
  }, []);

  return (
    <>
    <div className="d-flex flex-column align-items-center p-4">
      <h2 className="text-center">Live Viewer</h2>
      <div
        ref={remotePlayerRef}
        style={{
          width: '100%',
          maxWidth: '100%',
          height: '500px',
          backgroundColor: 'black',
        }}
      />
    </div>
    <Chat />
    </>
  );
}
