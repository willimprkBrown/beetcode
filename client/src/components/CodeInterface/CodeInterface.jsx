// CodeInterface.jsx

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './CodeInterface.css';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:3001'; // Replace with your server endpoint

const CodeInterface = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [roomId, setRoomId] = useState('')
  const [flipped, setFlipped] = useState(false)
  const [disrupt, setDisrupt] = useState(false)

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const handleJoinRoom = () => {
    let user = localStorage.getItem('user')
    if (!user) {
      user = "Guest"
    }
    socket.emit('joinRoom', user);
  };

  const handleFlip = () => {
    socket.emit('flip', { roomId })
  }

  const handleDisrupt = () => {
    socket.emit('disrupt', { roomId })
  }

  useEffect(() => {
    if (!socket) return;

    socket.on('flipped', () => {
      console.log("Flipping")
      setFlipped(true)

      setTimeout(() => {
        setFlipped(false)
      }, 10000)
    })

    socket.on('disrupted', () => {
      console.log('Disrupted')
      setDisrupt(true)

      setTimeout(() => {
        setDisrupt(false)
      }, 10000)
    })

    socket.on('joined', ({ roomid }) => {
      console.log("Joined " + roomid)
      setRoomId(roomid)
    })

    return () => {
      socket.off('flipped');
    };
  }, [socket]);

  const handleCodeChange = (value) => {
    if (disrupt && value.length % 10 == 0) {
      value += '🤯'
    }

    setCode(value)
  }

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
              language: language
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

  return (
    <>
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
          { !flipped && <div id="editor-panel" className="editor-panel">
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
          </div> }
          { flipped && <div id="editor-panel" className="editor-panel flipped">
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
          </div> }
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
        <div className="input-box">
          <button onClick={handleFlip}>Flip</button>
          <button onClick={handleDisrupt}>Disrupt</button>
        </div>
      </div>
    </>
  );
};

export default CodeInterface;
