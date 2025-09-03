import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-content">
        <h1 className="nav-title">AI Lead Generator</h1>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={isActiveRoute('/') ? 'active' : ''}
            >
              Search Business
            </Link>
          </li>
          <li>
            <Link 
              to="/my-businesses"
              className={isActiveRoute('/my-businesses') ? 'active' : ''}
            >
              My Businesses
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;