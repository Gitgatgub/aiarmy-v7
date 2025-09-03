import React, { useState, useEffect } from 'react';

function SettingsPage() {
  const [settings, setSettings] = useState({
    vapiKey: '',
    assistantId: '',
    phoneNumberId: ''  // Added this field
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h2>Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="settings-group">
           <label htmlFor="vapiKey">Vapi Private API Key</label>
            <input
              type="text"
              id="vapiKey"
              name="vapiKey"
              value={settings.vapiKey}
              onChange={handleChange}
              placeholder="Enter your Vapi Private API key"
              className="settings-input"
            />
          </div>
          
          <div className="settings-group">
            <label htmlFor="assistantId">Assistant ID</label>
            <input
              type="text"
              id="assistantId"
              name="assistantId"
              value={settings.assistantId}
              onChange={handleChange}
              placeholder="Enter your Assistant ID"
              className="settings-input"
            />
          </div>

          <div className="settings-group">
            <label htmlFor="phoneNumberId">Phone Number ID</label>
            <input
              type="text"
              id="phoneNumberId"
              name="phoneNumberId"
              value={settings.phoneNumberId}
              onChange={handleChange}
              placeholder="Enter your Vapi Phone Number ID"
              className="settings-input"
            />
            <small className="settings-help">
              Import your Twilio number in Vapi to get this ID
            </small>
          </div>

          <button type="submit" className="settings-button">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;