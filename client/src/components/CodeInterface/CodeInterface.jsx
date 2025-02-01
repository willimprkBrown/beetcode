import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import "./CodeInterface.css";

const CodeInterface = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleRun = async () => {
    setIsLoading(true);
    setOutput("Running code...");

    try {
      const response = await fetch("http://localhost:3001/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          code: code,
          language: language,
          version: "latest"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output || "No output");
      } else {
        setOutput(data.error || "Error: Unable to execute code");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (<>
    <div className="problem-container">
      <div className="problem-statement">
        <p>Some Problem I Guess</p>
      </div>
    </div>
    <div className="editor-container">
      <div className="language-selector">
        <select
          id="language-selector"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>
      <div className="editor-wrapper">
        <Editor
          height="400px"
          width="800px"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={handleCodeChange}
        />
      </div>
      <div className="button-container">
        <button className="run-button" onClick={handleRun} disabled={isLoading}>
          {isLoading ? "Running..." : "Run Code"}
        </button>
      </div>
      <div className="output-container">
        <h2>Output:</h2>
        <pre className="output-content">{output}</pre>
      </div>
    </div>
    </>
  );
};

export default CodeInterface;