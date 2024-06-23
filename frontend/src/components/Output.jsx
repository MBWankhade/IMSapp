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
    <div className='flex flex-col w-full'>
      <div>
        <button onClick={handleRun}>Run</button>
      </div>
      <p>Input</p>
      <textarea className='h-full w-full outline-none bg-black text-white' value={input} onChange={handleChange}/>
      <p>Output</p>
      <div className='h-full w-full bg-black my-5 text-white'>{output}</div>
    </div>
  );
}

export default Output;
