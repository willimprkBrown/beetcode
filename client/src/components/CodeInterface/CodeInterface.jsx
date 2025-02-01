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
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: language,
          version: "latest",
          files: [
            {
              content: code,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.run) {
        setOutput(data.run.output || "No output");
      } else {
        setOutput("Error: Unable to execute code.");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="language-selector">
        <select
          id="language-selector"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
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
  );
};

export default CodeInterface;