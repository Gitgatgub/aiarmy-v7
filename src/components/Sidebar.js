import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? '✕' : '☰'}
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img src="/logo.png" alt="AI Army" className="logo-image" />
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link
            to="/"
            className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="sidebar-icon">🔍</span>
            <span className="sidebar-text">Search Business</span>
          </Link>
          <Link
            to="/saved-searches"
            className={`sidebar-link ${isActive('/saved-searches') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
     <span className="sidebar-icon">📋</span>
            <span className="sidebar-text">Saved Searches</span>
          </Link>
          <a href="https://vapipoc-v26.netlify.app/login" target="_blank" rel="noopener noreferrer" className="sidebar-link">
            <span className="sidebar-icon">🏢</span>
            <span className="sidebar-text">Business Portal</span>
          </a>
        </nav>
        <div className="sidebar-footer">
          <p className="version-text">Version 1.0</p>
        </div>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}

export default Sidebar;