import Peer from 'peerjs';
import React, { useState, createContext, useEffect, useRef } from 'react';

export const DataContext = createContext();

export const DataProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("");
    const [roomId, setRoomId] = useState("");
    const [peerId, setPeerId] = useState('');
    const peerInstance = useRef(null);

    useEffect(() => {

      const storedUser = localStorage.getItem('token');
        if (storedUser) {
            setUser(storedUser);
        }

      const peer = new Peer();

      peer.on('open', (id) => {
        setPeerId(id);
      });
  
      peerInstance.current = peer;
      
    }, [])
    

    return (
        <DataContext.Provider value={{user, setUser, status, setStatus, roomId, setRoomId, peerInstance, peerId}}>
            {children}
        </DataContext.Provider>
    );
}
