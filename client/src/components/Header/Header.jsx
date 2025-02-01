import './Header.css'
import React from 'react';

const Header = () => {
    return (
        <div className="header-container">
            <h1 className="header-title"> beetcode </h1>
            <div className="grid">
                <button>Match</button>
                <button>Profile</button>
            </div>
        </div>
       
    );
};

export default Header
