import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Login Component
function Login() {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const loginRef = useRef("");
  const passwordRef = useRef("");

  const authenticate = async () => {
    const response = await fetch("https://beetcode-11s8.onrender.com/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: loginRef.current.value,
        password: passwordRef.current.value,
      }),
    });
    if (response.statusText !== "Unauthorized") {
      const user = await response.json();
      localStorage.setItem("user", user.user);
      navigate("/select");
    } else {
      setStatus("LOGIN FAILED");
    }
  };

  const navRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      <div className="container">
        <img src="/tetris.gif" alt="Tetris Logo" className="login-image" />
        <div>
          <input ref={loginRef} type="text" placeholder="username" />
          <br />
          <input ref={passwordRef} type="text" placeholder="password" />
          <br />
          <div className="button2-container">
            <button
              onClick={authenticate}
              type="submit"
              className="gameboy-button"
            >
              <span>LOGIN</span>
            </button>
            <button onClick={navRegister} className="gameboy-button">
              <span>REGISTER</span>
            </button>
          </div>
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}

// Register Component
function Register() {
  const [status, setStatus] = useState();
  const navigate = useNavigate();
  const userRef = useRef("");
  const pwRef = useRef("");

  const registry = async () => {
    const response = await fetch("https://beetcode-11s8.onrender.com/register", {
      method: "post",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userRef.current.value,
        password: pwRef.current.value,
      }),
    });

    const status = await response.json();
    if (status.status) {
      navigate("/login");
    } else {
      setStatus("REGISTER FAILED");
    }
  };

  const navLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-page">
      <div className="container">
        <img src="/path-to-your-image.jpg" alt="Logo" className="login-image" />
        <div>
          <h2>Register New User</h2>
          <input ref={userRef} type="text" placeholder="username" />
          <input ref={pwRef} type="text" placeholder="password" />
          <div className="button2-container">
            <button onClick={registry} type="submit" className="gameboy-button">
              <span>REGISTER</span>
            </button>
            <button onClick={navLogin} className="gameboy-button">
              <span>LOGIN</span>
            </button>
          </div>
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}

export { Login, Register };
