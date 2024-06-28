// import React, { useEffect, useMemo, useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { io } from "socket.io-client";


// function Notepad({socket, roomId}) {

//   const [value, setValue] = useState('');

//   useEffect(() => {
//     // socket.on("connect", () => {
//     //   console.log("connected", socket.id);
//     // });


//     socket.on("recieve-text", (data) => {
//         console.log(data);
//         setValue(data);
//         });


//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const handleSubmit = () => {
//     console.log(value);
//   }

//   const handleChange = (newValue) => {
//     setValue(newValue);
//     socket.emit("text-change", { room: roomId, data: newValue });
//     console.log(newValue); 
//   }

//   return (
//     <>
//       <ReactQuill theme="snow" value={value} onChange={handleChange} className='w-10/12 h-5/6 px-4 text-white'/>
//     </>
//   )
// }

// export default Notepad;




import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function Notepad({ roomId }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('recieve-text', (data) => {
      console.log(data);
      setValue(data);
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.disconnect();
    };
  }, [roomId]);

  const handleChange = (newValue) => {
    setValue(newValue);
    socket.emit('text-change', { room: roomId, data: newValue });
    console.log(newValue); 
  };

  return (
    <ReactQuill theme="snow" value={value} onChange={handleChange} className='w-10/12 h-5/6 px-4 text-white'/>
  );
}

export default Notepad;
