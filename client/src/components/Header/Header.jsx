import "./Header.css";
import React from "react";

const Header = () => {
  return (
    <div className="header-container">
      <div className="header-title-container">
        <img
          className="header-icon"
          src={`${process.env.PUBLIC_URL}/beet.png`}
          alt="Beet Icon"
        />
        <h1 className="header-title">beetcode</h1>
      </div>
    </div>
  );
};

export default Header;
