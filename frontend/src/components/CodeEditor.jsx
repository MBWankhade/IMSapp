import React, { useEffect, useMemo, useRef, useState } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { io } from "socket.io-client";
import LanguageDropdown from "./LanguageDropdown";
import Output from "./Output";

function CodeEditor() {
  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
      }),
    []
  );

  const [value, setValue] = useState("");
  const [socketId, setSocketId] = useState("");
  const [language, setLanguage] = useState("c");
  const [version, setVersion] = useState("10.2.0");

  const editorRef = useRef(null);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    editor.focus();
  }

  function handleEditorChange(value, event) {
    setValue(value);
    socket.emit("message", value);
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("recieve-message", (data) => {
      console.log(data);
      setValue(data);
    });

    socket.on("recieve-language", ({ language, version }) => {
      setLanguage(language);
      setVersion(version);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className="flex mt-10 gap-4 px-10">
        <div>
          <div className="flex items-center gap-4 px-4 mt-3">
            <p className="text-xl font-semibold text-white">Language:</p>
            <LanguageDropdown
              langSetter={setLanguage}
              verSetter={setVersion}
              socket={socket}
              lang={language}
              ver={version}
            />
          </div>
          <Editor
            height="50vh"
            theme="vs-dark"
            width="50vw"
            language={language}
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            className="my-4"
          />
        </div>
        <Output
          version={version}
          language={language}
          value={value}
          socket={socket}
        />
      </div>
    </>
  );
}

export default CodeEditor;
