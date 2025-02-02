import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import './CodeInterface.css';
import io from 'socket.io-client';
import ProblemBank from './ProblemBank.jsx'

const ENDPOINT = 'https://beetcode-11s8.onrender.com'; // Replace with your server endpoint

const CodeInterface = () => {

  const nav = useNavigate()
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [flipped, setFlipped] = useState(false);
  const [disrupt, setDisrupt] = useState(false);
  const [hallucinate, setHallucinate] = useState(false);

  const [selectedCharacter, setSelectedCharacter] = useState('')
  
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
      
        if (newEditorHeight > 200 && newEditorHeight < containerHeight - 150) {
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

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    const character = localStorage.getItem('character')
    console.log(character)
    setSelectedCharacter(character)

    return () => {
      newSocket.close();
    }
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

  const handleHallucinate = () => {
    socket.emit('hallucinate', { roomId })

    setHallucinate(true)
  }

  useEffect(() => {
    if (!socket) return;

    handleJoinRoom()

    socket.on('flipped', () => {
      console.log("Flipping")
      setFlipped(true)

      setTimeout(() => {
        setFlipped(false)
      }, 10000)
    }, [socket, handleJoinRoom])

    socket.on('disrupted', () => {
      console.log('Disrupted')
      setDisrupt(true)

      setTimeout(() => {
        setDisrupt(false)
      }, 10000)
    })

    socket.on('hallucinating', () => {
      console.log("Hallucinating")
      setHallucinate(3)
    })

    socket.on('winned', ({ user }) => {
      console.log('win')
      setOutput(user + " Won!")
      setTimeout(() => {
        nav('/select#')
      }, 5000)
    })

    function toggleBlur() {
      setTimeout(() => {
        var overlay = document.querySelector('.blur-overlay');
        overlay.classList.toggle('active'); 
      }, 5000)
    }

    socket.on('joined', ({ roomid }) => {
      console.log("Joined " + roomid)

      toggleBlur()
      setRoomId(roomid)
    })

    return () => {
      socket.off('flipped');
      socket.off('joined')
      socket.off('disrupted')
    };
  }, [socket]);

  const handleCodeChange = (value) => {
    if (disrupt && value.length % 10 === 0) {
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

    const newCode = code + `
print(twoSum([2, 7, 11, 15], 9))
    `
  
    try {
      // First request: execute original code
      const response1 = await fetch("https://beetcode-11s8.onrender.com/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: newCode,
          language: language,
        }),
      });
  
      const data1 = await response1.json();
  
      if (!response1.ok) {
        setOutput(data1.error || "Error: Unable to execute code");
        return; // Exit early if the first request failed
      }
  
      setOutput(data1.output || "No output");

    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }
  

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setOutput("Running code...");
    try {
      const updatedCode = appendTestCasesToCode(code);
      const response2 = await fetch("https://beetcode-11s8.onrender.com/execute", {
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
      
      if (hallucinate > 0) {
        setHallucinate(prev => prev - 1)
        setOutput("u wrong")
      } else
      if (response2.ok && checkTestCases(data2.output, ProblemBank[0][1])) {

        setOutput("u right");

        let user = localStorage.getItem('user')

        socket.emit('win', { user, roomId })

      } else {
        setOutput(data2.error || "u wrong");
      }
  
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  


  const checkTestCases = (actualOutput, testCases) => {    // Split both the actual and expected outputs into individual lines
    const actualLines = actualOutput.trim().split('\n');
    const expectedLines = Object.values(testCases).map(testCase => {
      const jsonString = JSON.stringify(testCase.expectedOutput);
      return jsonString.replace(/,/g, ', '); // Add space after commas
    });

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

  const powerUps = {
    "Cauliflower":<span>
                    <i class="fa-solid fa-bolt power-up" onClick={handleFlip}></i>
                  </span>,
    "Beet":<span>
            <i class="fa-solid fa-bolt power-up" onClick={handleDisrupt}></i>
          </span>,
    "Mushroom": <span>
                  <i class="fa-solid fa-bolt power-up" onClick={handleHallucinate}></i>
                </span>, 
  }
  

  return (
    <>
      <div class="blur-overlay active"></div>
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


          { selectedCharacter && powerUps[selectedCharacter] }



            <button className="run-button" onClick={handleRun} disabled={isLoading}>
              {isLoading ? "Running..." : "Run"}
            </button>

            <button className="submit-button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
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
    </>
  );
};

export default CodeInterface;