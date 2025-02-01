import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'


function Login() {

    const navigate = useNavigate()

    return (
        <div>Login</div>
    )
}


function Register() {

    return (
        <div>Register</div>
    )
}

export {
    Login, 
    Register
}