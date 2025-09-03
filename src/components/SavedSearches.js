import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';

const SavedSearches = ({ onLoadSearch }) => {
  const [savedSearches, setSavedSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Use useCallback to ensure function reference remains stable for useEffect
  const loadSavedSearches = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const searchesRef = collection(db, 'saved_searches');
      const q = query(searchesRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const searches = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by createdAt timestamp (string format)
      searches.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setSavedSearches(searches);
    } catch (error) {
      console.error('Error loading saved searches:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // useEffect now correctly depends on loadSavedSearches
  useEffect(() => {
    loadSavedSearches();
  }, [loadSavedSearches]);

  const deleteSearch = async (searchId) => {
    try {
      await deleteDoc(doc(db, 'saved_searches', searchId));
      setSavedSearches(prev => prev.filter(search => search.id !== searchId));
    } catch (error) {
      console.error('Error deleting search:', error);
    }
  };

  const handleExportCSV = (search) => {
    if (!search.results || !search.results.length) {
      alert("No results to export.");
      return;
    }
    // CSV header
    const header = ['Business Name', 'Phone', 'Email'];
    // Map each business result to a CSV row
    const rows = search.results.map(business => [
      business.businessName,
      business.telephoneNumber || '',
      business.emailAddress || ''
    ]);
    // Build CSV content: wrap each field in quotes to handle commas, then join rows with newlines
    const csvContent = [header, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    // Create a filename using the search parameters (e.g., "Gardener_Bristol.csv")
    const filename = `${search.businessType}_${search.location}.csv`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: '#e5e7eb' 
      }}>
        Loading saved searches...
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '56rem', 
      margin: '0 auto', 
      padding: '1.5rem' 
    }}>
      <h2 style={{ 
        fontSize: '2rem', 
        fontWeight: '700', 
        marginBottom: '1.5rem', 
        color: '#fff',
        fontFamily: 'Space Grotesk, sans-serif'
      }}>
        Saved Searches
      </h2>
      {savedSearches.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No saved searches yet</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {savedSearches.map((search) => (
            <div
              key={search.id}
              style={{
                background: '#1A1A1A',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #2A2A2A',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ 
                  fontWeight: '600', 
                  fontSize: '1.125rem',
                  color: '#00FFA3',
                  marginBottom: '0.25rem'
                }}>
                  {search.businessType}
                </p>
                <p style={{ 
                  color: '#9ca3af',
                  fontSize: '0.875rem'
                }}>
                  in {search.location}
                </p>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.75rem',
                  marginTop: '0.5rem'
                }}>
                  {search.results?.length || 0} results • {new Date(search.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() =>
                    onLoadSearch({
                      businessType: search.businessType,
                      location: search.location,
                      results: search.results
                    })
                  }
                  style={{
                    background: 'linear-gradient(135deg, #00FFA3 0%, #00CC82 100%)',
                    color: '#0A0A0A',
                    padding: '0.5rem 1.25rem',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 255, 163, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Load
                </button>
                <button
                  onClick={() => handleExportCSV(search)}
                  style={{
                    background: 'transparent',
                    color: '#00FFA3',
                    padding: '0.5rem 1.25rem',
                    border: '1px solid #00FFA3',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(0, 255, 163, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Export CSV
                </button>
                <button
                  onClick={() => deleteSearch(search.id)}
                  style={{
                    background: 'transparent',
                    color: '#FF4A4A',
                    padding: '0.5rem 1.25rem',
                    border: '1px solid #FF4A4A',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255, 74, 74, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedSearches;