import React, { useContext } from 'react'
import { DataContext } from '../context/DataProvider';
import AudioVideoScreen from '../components/AudioVideoScreen';


function MainPage() {
    const {peerId, roomId, status} = useContext(DataContext);
  return (
    <div className='h-screen w-screen bg-gray-800'>
        <AudioVideoScreen/>
    </div>
  )
}

export default MainPage