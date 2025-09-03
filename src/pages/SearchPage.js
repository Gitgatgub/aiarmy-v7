import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import ResultsTable from '../components/ResultsTable';
import { searchBusinesses } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function SearchPage() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const location = useLocation();

  // Handle incoming saved results or search parameters
  useEffect(() => {
    if (location.state?.results) {
      // If we have results, display them immediately
      setResults(location.state.results);
    }
  }, [location.state]);

  const handleSearch = async (businessType, location) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting search for:', businessType, location);
      const data = await searchBusinesses(businessType, location);
      console.log('Raw AI data:', data);
      console.log('First result details:', JSON.stringify(data[0], null, 2));
      
      // Add test entry to every search
      setResults([...data, {
        businessName: "RW Services",
        website: "N/A",
        businessSummary: "RW Services offers professional business consulting and AI solutions for SMBs",
        telephoneNumber: "+447935592032", // Your verified UK number
        emailAddress: "rich.williams@mail.com"
      }]);
    
      // Auto-save successful searches
      if (data.length > 0 && user) {
        try {
          await addDoc(collection(db, 'saved_searches'), {
            userId: user.uid,
            businessType,
            location,
            results: data,
            createdAt: new Date().toISOString()
          });
        } catch (saveErr) {
          console.error('Error saving search:', saveErr);
          // Don't set error state as the search itself was successful
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'An error occurred while searching');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <SearchForm
        onSearch={handleSearch}
        isLoading={isLoading}
        initialBusinessType={location.state?.businessType}
        initialLocation={location.state?.location}
      />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-4">Searching for businesses...</div>
      ) : (
        results.length > 0 && <ResultsTable results={results} />
      )}
    </div>
  );
}

export default SearchPage;