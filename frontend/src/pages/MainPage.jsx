import React, { useContext } from 'react'
import { DataContext } from '../context/DataProvider';


function MainPage() {
    const {peerId, roomId, status} = useContext(DataContext);
  return (
    <div>
        <div>Peer: {peerId}</div>
        <div>Room: {roomId}</div>
        <div>status: {status}</div>
    </div>
  )
}

export default MainPage