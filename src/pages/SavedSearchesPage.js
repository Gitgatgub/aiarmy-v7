  import React from 'react';
  import SavedSearches from '../components/SavedSearches';
  import { useAuth } from '../contexts/AuthContext';
  import { useNavigate } from 'react-router-dom';

  function SavedSearchesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLoadSearch = (search) => {
      navigate('/', { 
        state: { 
          businessType: search.businessType,
          location: search.location,
          results: search.results  // Pass the full results
        } 
      });
    };

    const handleExportCSV = (search) => {
      // Create CSV content from the saved search results
      const headers = ['Business Name', 'Phone', 'Email'];
      const csvRows = [
        headers,
        ...search.results.map(result => [
          result.businessName,
          result.phone,
          result.email
        ])
      ];

      const csvContent = csvRows.map(row => 
        row.map(cell => 
          cell?.includes(',') ? `"${cell}"` : cell
        ).join(',')
      ).join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${search.businessType}_${search.location}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="page-container">
        {user && (
          <SavedSearches 
            onLoadSearch={handleLoadSearch}
            onExportCSV={handleExportCSV}
          />
        )}
      </div>
    );
  }

  export default SavedSearchesPage;