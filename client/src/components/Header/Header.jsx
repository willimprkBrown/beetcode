import './Header.css';
import React from 'react';

const Header = () => {
    return (
        <div className="header-container">
            <h1 className="header-title">beetcode</h1>
            <div className="grid">
                <div className="button-wrapper">
                    <div className="button-ring">
                        <button> </button>
                    </div>
                    <div className="button-label">match</div>
                </div>
                <div className="button-wrapper">
                    <div className="button-ring">
                        <button> </button>
                    </div>
                    <div className="button-label">profile</div>
                </div>
            </div>
        </div>
    );
};

export default Header;