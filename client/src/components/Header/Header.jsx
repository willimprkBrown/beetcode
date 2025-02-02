import "./Header.css";
import React from "react";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="header-container">
      <div className="header-title-container">
        <img
          className="header-icon"
          src={`${process.env.PUBLIC_URL}/beet.png`}
          alt="Beet Icon"
        />
        <Link to='/select'>
          <h1 style={{ userSelect: 'text' }} className="header-title">beetcode</h1>
        </Link>
      </div>
    </div>
  );
};

export default Header;
