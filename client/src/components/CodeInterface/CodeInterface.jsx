// CodeInterface.jsx

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './CodeInterface.css';
import io from 'socket.io-client';
import ProblemBank from './ProblemBank.jsx'

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
    const updatedCode = appendTestCasesToCode(code);
    console.log(updatedCode);
  
    try {
      // First request: execute original code
      const response1 = await fetch("http://localhost:3001/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          language: language,
        }),
      });
  
      const data1 = await response1.json();
  
      if (!response1.ok) {
        setOutput(data1.error || "Error: Unable to execute code");
        return; // Exit early if the first request failed
      }
  
      setOutput(data1.output || "No output");
  
      // Wait for 200ms before making the second request
      await new Promise(resolve => setTimeout(resolve, 200));
  
      // Second request: execute updated code (after the delay)
      const response2 = await fetch("http://localhost:3001/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: updatedCode,
          language: language,
        }),
      });
  
      const data2 = await response2.json();
  
      if (response2.ok && checkTestCases(data2.output, ProblemBank[0][1])) {
        setOutput("u right");
      } else {
        setOutput(data2.error || "u wrong");
      }
  
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  


  const checkTestCases = (actualOutput, testCases) => {
    console.log(actualOutput)
    // Split both the actual and expected outputs into individual lines
    const actualLines = actualOutput.trim().split('\n');
    const expectedLines = Object.values(testCases).map(testCase => {
      const jsonString = JSON.stringify(testCase.expectedOutput);
      return jsonString.replace(/,/g, ', '); // Add space after commas
    });
    console.log(actualLines, expectedLines);
    console.log('hello');

    // Check if the number of lines match
    if (actualLines.length !== expectedLines.length) {
      return false;
    }

    // Compare each line one by one
    for (let i = 0; i < actualLines.length; i++) {
      if (actualLines[i] !== expectedLines[i]) {
        return false;
      }
    }

    // If all lines match
    return true;
  }

  const appendTestCasesToCode = (code) => {
    const testCases = ProblemBank[0][1];
  
    let updatedCode = code;
  
    for (let key in testCases) {
      const testCase = testCases[key];
      const { nums, target } = testCase;
  
      updatedCode += `
print(twoSum(${JSON.stringify(nums)}, ${JSON.stringify(target)}));
      `;
    }
  
    return updatedCode;
  };
  

  return (
    <>
      <div className="container">
        <div id="left-panel" className="left-panel">
         {ProblemBank[0][0]}
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
          { !flipped ? <div id="editor-panel" className="editor-panel">
            <Editor
              height="100%"
              width="100%"
              language={language}
              value={code}
              onChange={handleCodeChange}
              defaultLanguage="python"
              defaultValue={`${ProblemBank[0][2]}`}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20 },
              }}
            />
          </div> : <div id="editor-panel" className="editor-panel flipped">
            <Editor
              height="100%"
              width="100%"
              language={language}
              value={code}
              onChange={handleCodeChange}
              defaultLanguage="python"
              defaultValue={`${ProblemBank[0][2]}`}
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

        <div className="input-box">
          <button onClick={handleJoinRoom}>Join Room</button> <br></br>
          <button onClick={handleFlip}>Flip</button> <br></br>
          <button onClick={handleDisrupt}>Disrupt</button>
        </div>
    </>
  );
};

export default CodeInterface;
