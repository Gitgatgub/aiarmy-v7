// SearchForm.js
import React, { useState, useEffect } from 'react';

function SearchForm({ onSearch, isLoading, initialBusinessType, initialLocation }) {
  const [businessType, setBusinessType] = useState(initialBusinessType || '');
  const [location, setLocation] = useState(initialLocation || '');

  // Update form when initial values change (from saved search)
  useEffect(() => {
    if (initialBusinessType) setBusinessType(initialBusinessType);
    if (initialLocation) setLocation(initialLocation);
  }, [initialBusinessType, initialLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (businessType.trim() && location.trim()) {
      onSearch(businessType.trim(), location.trim());
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          placeholder="Enter business type (e.g., dentist)"
          className="search-input"
          disabled={isLoading}
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location (e.g., New York)"
          className="search-input"
          disabled={isLoading}
          required
        />
        <button
          type="submit"
          className="search-button"
          disabled={isLoading || !businessType.trim() || !location.trim()}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}

export default SearchForm;