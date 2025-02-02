import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './CodeInterface.css';

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
          body: JSON.stringify({
              code: code,
              language: language  // Remove version from here
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

  useEffect(() => {
    const verticalResizer = document.getElementById('vertical-resizer');
    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-panel');
    const horizontalResizer = document.getElementById('horizontal-resizer');
    const editorPanel = document.getElementById('editor-panel');
    const consolePanel = document.getElementById('console-panel');

    let isVerticalResizing = false;
    let startX = 0;
    let leftWidth = 0;

    const handleVerticalMouseDown = (e) => {
      isVerticalResizing = true;
      startX = e.clientX;
      leftWidth = leftPanel.offsetWidth;
      document.addEventListener('mousemove', handleVerticalMouseMove);
      document.addEventListener('mouseup', handleVerticalMouseUp);
    };

    const handleVerticalMouseMove = (e) => {
      if (!isVerticalResizing) return;
      const dx = e.clientX - startX;
      const newLeftWidth = leftWidth + dx;
      const containerWidth = document.querySelector('.container').offsetWidth;
      
      if (newLeftWidth > 300 && newLeftWidth < containerWidth - 400) {
        leftPanel.style.width = `${newLeftWidth}px`;
        rightPanel.style.width = `calc(100% - ${newLeftWidth}px)`;
      }
    };

    const handleVerticalMouseUp = () => {
      isVerticalResizing = false;
      document.removeEventListener('mousemove', handleVerticalMouseMove);
      document.removeEventListener('mouseup', handleVerticalMouseUp);
    };

    // Horizontal resizing (editor-console)
    let isHorizontalResizing = false;
    let startY = 0;
    let editorHeight = 0;

    const handleHorizontalMouseDown = (e) => {
      isHorizontalResizing = true;
      startY = e.clientY;
      editorHeight = editorPanel.offsetHeight;
      document.addEventListener('mousemove', handleHorizontalMouseMove);
      document.addEventListener('mouseup', handleHorizontalMouseUp);
    };

    const handleHorizontalMouseMove = (e) => {
        if (!isHorizontalResizing) return;
        const dy = e.clientY - startY;
        const newEditorHeight = editorHeight + dy;
        const containerHeight = rightPanel.offsetHeight;
      
        if (newEditorHeight > 200 && newEditorHeight < containerHeight - 300) {
          editorPanel.style.height = `${newEditorHeight}px`;
          consolePanel.style.flex = `1 1 auto`;
        }
      };

    const handleHorizontalMouseUp = () => {
      isHorizontalResizing = false;
      document.removeEventListener('mousemove', handleHorizontalMouseMove);
      document.removeEventListener('mouseup', handleHorizontalMouseUp);
    };

    verticalResizer.addEventListener('mousedown', handleVerticalMouseDown);
    horizontalResizer.addEventListener('mousedown', handleHorizontalMouseDown);

    return () => {
      verticalResizer.removeEventListener('mousedown', handleVerticalMouseDown);
      horizontalResizer.removeEventListener('mousedown', handleHorizontalMouseDown);
      document.removeEventListener('mousemove', handleVerticalMouseMove);
      document.removeEventListener('mouseup', handleVerticalMouseUp);
      document.removeEventListener('mousemove', handleHorizontalMouseMove);
      document.removeEventListener('mouseup', handleHorizontalMouseUp);
    };
  }, []);

  return (<>
    <div className="container">
      <div id="left-panel" className="left-panel">
        <div className="problem-description">
          <h2>Two Sum</h2>
          <p>Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.</p>
          
          <div className="example-flow">
            <p>Example 1:</p>
            <p>Input: nums = [2,7,11,15], target = 9</p>
            <p>Output: [0,1]</p>
            <p>Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</p>
          </div>

          <ul className="constraints-list">
            <li>2 ≤ nums.length ≤ 10⁴</li>
            <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
            <li>-10⁹ ≤ target ≤ 10⁹</li>
            <li>Only one valid answer exists.</li>
          </ul>
        </div>
      </div>

      <div id="vertical-resizer" className="resizer vertical-resizer"></div>

      <div id="right-panel" className="right-panel">
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
        <div id="editor-panel" className="editor-panel flipped">
          <Editor
            height="100%"
            width="100%"
            language={language}
            value={code}
            onChange={handleCodeChange}
            defaultLanguage="javascript"
            defaultValue="// Your solution here"
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 20 },
            }}
          />
        </div>
        <div className="button-container">
          <button className="run-button" onClick={handleRun} disabled={isLoading}>
            {isLoading ? "Running..." : "Run"}
          </button>
        </div>

        <div id="horizontal-resizer" className="resizer horizontal-resizer"></div>

        <div id="console-panel" className="console-panel">
          <div className="console-output">
            <pre>{ output }</pre>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CodeInterface;