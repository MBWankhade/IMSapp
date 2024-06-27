import React, { useEffect, useState } from 'react';

function Output({language, version, value, socket}) {

  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");

  const handleRun = async ()=>{
    try {
      const reqBody = {
        language,
        version,
        files : [
          {
            content: value,
          }
        ],
        stdin: input
      }
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody)
      })

      const data = await res.json();
      console.log(data)
      setOutput(data.run.stdout + '\n'+ data.run.stderr);
      socket.emit("output-change", data.run.stdout + '\n'+ data.run.stderr);
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(event) {
    const newValue = event.target.value;
    setInput(newValue);
    socket.emit("input-change", newValue);
  }

  useEffect(() => {
    socket.on("recieve-input", (data) => {
      console.log(data);
      setInput(data);
    });

    socket.on("recieve-output", (data) => {
      console.log(data);
      setOutput(data);
    });

    return () => {
      socket.off("receive-input");
    };
  }, [socket])
  

  return (
    <div className='flex flex-col w-full py-4'>
      <div>
        <button className='text-lg font-semibold text-white bg-blue-500 rounded-xl shadow-xl px-4 py-1' onClick={handleRun}>Run</button>
      </div>
      <p className='text-lg font-semibold mt-3 text-white'>Input</p>
      <textarea className='h-full w-full outline-none border-2 border-gray-500 rounded-lg shadow-xl text-semibold p-2' value={input} onChange={handleChange}/>
      <p className='text-lg font-semibold mt-3 text-white'>Output</p>
      <div className='h-full w-full border-2 border-gray-500 rounded-lg shadow-xl text-semibold bg-white p-2'>{output}</div>
    </div>
  );
}

export default Output;
