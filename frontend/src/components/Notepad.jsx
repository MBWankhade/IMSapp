import React, { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { io } from "socket.io-client";


function Notepad() {

const socket = useMemo(
    () =>
        io("http://localhost:3000", {
            withCredentials: true,
        }),[]);

  const [value, setValue] = useState('');

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });


    socket.on("recieve-text", (data) => {
        console.log(data);
        setValue(data);
        });


    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = () => {
    console.log(value);
  }

  const handleChange = (newValue) => {
    setValue(newValue);
    socket.emit("text-change", newValue);
    console.log(newValue); 
  }

  return (
    <>
        <div>
            <ReactQuill theme="snow" value={value} onChange={handleChange}  className='w-1/2 h-96 mx-auto'/>
        </div>
    </>
  )
}

export default Notepad;
