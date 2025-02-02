import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App';
import { Login, Register } from './pages/Login';
import { CharacterSelect } from './pages/CharacterSelect';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header.jsx';
import ClawMachine from './components/UI/ClawMachine.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Header />
      <Routes>
        <Route index element={<ClawMachine />} />
        <Route path="match" element={<App />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="select" element={<CharacterSelect />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

reportWebVitals();
