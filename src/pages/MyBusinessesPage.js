import React from 'react';

function MyBusinessesPage() {
  return (
    <div className="my-businesses-page">
      <div className="page-header">
        <h2>My Saved Businesses</h2>
        <p className="feature-notice">
          This feature will be available in a future update.
        </p>
      </div>
      <div className="placeholder-content">
        <div className="placeholder-message">
          <span className="placeholder-icon">🔄</span>
          <h3>Coming Soon</h3>
          <p>You'll be able to save and manage your favorite businesses here.</p>
          <ul className="feature-list">
            <li>Save businesses for later reference</li>
            <li>Track communication history</li>
            <li>Set follow-up reminders</li>
            <li>Add personal notes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyBusinessesPage;