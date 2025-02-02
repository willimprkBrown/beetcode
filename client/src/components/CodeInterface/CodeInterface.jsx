import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import Editor from '@monaco-editor/react';
import './CodeInterface.css';
import io from 'socket.io-client';
import ProblemBank from './ProblemBank.jsx';

const ENDPOINT = 'http://localhost:3001'; // Replace with your server endpoint

const CodeInterface = () => {
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
  const [selectedCharacter, setSelectedCharacter] = useState('');

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

  const handleJoinRoom = useCallback(() => { // Wrapped in useCallback
    let user = localStorage.getItem('user');
    if (!user) {
      user = "Guest";
    }
    socket.emit('joinRoom', user);
  }, [socket]); // Dependencies are just 'socket'

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    const character = localStorage.getItem('character');
    console.log(character);
    setSelectedCharacter(character);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    handleJoinRoom();

    socket.on('flipped', () => {
      console.log("Flipping");
      setFlipped(true);

      setTimeout(() => {
        setFlipped(false);
      }, 10000);
    });

    socket.on('disrupted', () => {
      console.log('Disrupted');
      setDisrupt(true);

      setTimeout(() => {
        setDisrupt(false);
      }, 10000);
    });

    socket.on('hallucinating', () => {
      console.log("Hallucinating");
      setHallucinate(3);
    });

    function toggleBlur() {
      setTimeout(() => {
        var overlay = document.querySelector('.blur-overlay');
        overlay.classList.toggle('active');
      }, 5000);
    }

    socket.on('joined', ({ roomid }) => {
      console.log("Joined " + roomid);

      toggleBlur();
      setRoomId(roomid);
    });

    return () => {
      socket.off('flipped');
      socket.off('joined');
      socket.off('disrupted');
    };
  }, [socket, handleJoinRoom]); // handleJoinRoom is stable thanks to useCallback

  // Other functions (handleFlip, handleDisrupt, etc.) remain the same...

  return (
    <div className="container">
      {/* JSX code here remains unchanged */}
    </div>
  );
};

export default CodeInterface;
