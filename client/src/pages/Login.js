import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [status, setStatus] = useState('')
    const navigate = useNavigate();
    const loginRef = useRef('')
    const passwordRef = useRef('')

    const authenticate = async () => {
        const response = await fetch('http://localhost:3001/login', {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', 
            body: JSON.stringify({ 
                username: loginRef.current.value, 
                password: passwordRef.current.value })
        })
        if (response.statusText !== "Unauthorized") {
            const user = await response.json()
            localStorage.setItem('user', user.user)
            navigate("/")
        } else {
            setStatus("LOGIN FAILED")
        }
    }

    const navRegister = () => {
        navigate("/register")
    }
    
    return (
        <>
            <div>
                <button onClick={navRegister}>
                    REGISTER
                </button>
            </div>
            <div>
                <input ref={loginRef} type="text" placeholder="username" />
                <br />
                <input ref={passwordRef} type="text" placeholder="password" />
                <br />
                <button onClick={authenticate} type="submit">LOGIN</button> 
                <p>{status}</p>
            </div>
        </>
    )
}

function Register() {
    const [status, setStatus] = useState()
    const navigate = useNavigate();
    const userRef = useRef('')
    const pwRef = useRef('')

    const registry = async () => {

        console.log(userRef.current.value)
        console.log(pwRef.current.value)
        const response = await fetch('http://localhost:3001/register', {
            method: "post",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: userRef.current.value, 
                password: pwRef.current.value })
        })

        const status = await response.json()
        if (status.status) {
            navigate("/login")
        } else {
            setStatus("REGISTER FAILED")
        }
    }

    const navLogin = () => {
        navigate("/login")
    }

    return (
        <>
            <div>
                <button onClick={navLogin}>
                    LOGIN BUTTON
                </button>
                <div>
                    <h2>Register New user</h2>
                </div>
            </div>
            <div>
                <input ref={userRef} type="text" placeholder="username" />
                <input ref={pwRef} type="text" placeholder="password" />
                <div>
                    <button onClick={registry} type="submit">
                        REGISTER
                    </button> 
                </div>
                <p>{status}</p>
            </div>
        </>
    )
}

export {
    Login,
    Register
}