import React, { useState, useEffect } from 'react';
import { startCall, endCall } from '../services/vapiService';
import CallInterface from './CallInterface';

function ResultsTable({ results }) {
  const [activeCall, setActiveCall] = useState(null);
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState(null);

  // Listen for call end events from Vapi
  useEffect(() => {
    const handleCallEnded = (event) => {
      if (event.detail.businessName === activeCall) {
        setActiveCall(null);
        setIsCallLoading(false);
        console.log('Call ended for:', event.detail.businessName);
      }
    };
    
    window.addEventListener('vapiCallEnded', handleCallEnded);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('vapiCallEnded', handleCallEnded);
    };
  }, [activeCall]);

  if (!results || results.length === 0) {
    return null;
  }

  // Ensure website URLs have the proper protocol
  const getValidUrl = (url) => {
    if (!url || url === 'N/A') return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    } else {
      return `https://${url}`;
    }
  };

  // International phone number validation:
  // Validates phone numbers from multiple countries
  const isValidPhoneNumber = (number) => {
    if (!number || number === 'N/A') return false;
    const cleaned = number.replace(/[\s\-().]/g, '');
    
    // UK numbers
    if (cleaned.startsWith('+44') || cleaned.startsWith('0')) {
      return cleaned.length >= 10;
    }
    
    // US/Canada numbers
    if (cleaned.startsWith('+1') || cleaned.startsWith('1')) {
      return cleaned.length >= 10;
    }
    
    // International numbers (any + followed by country code)
    if (cleaned.startsWith('+')) {
      return cleaned.length >= 10;
    }
    
    // Local US format without country code (10 digits)
    if (cleaned.length === 10 && /^\d+$/.test(cleaned)) {
      return true;
    }
    
    // Default: accept any number with 7+ digits
    return cleaned.length >= 7;
  };

  const handleStartCall = async (business) => {
    try {
      if (activeCall === business.businessName) {
        endCall();
        setActiveCall(null);
        setShowCallInterface(false);
        setCurrentBusiness(null);
        return;
      }
      setIsCallLoading(true);
      setCurrentBusiness(business);
      setShowCallInterface(true);
      console.log('DEBUG: showCallInterface set to true, currentBusiness:', business.businessName);
      await startCall(business.businessName, business.telephoneNumber);
      setActiveCall(business.businessName);
    } catch (error) {
      console.error('Error handling call:', error);
      alert('Failed to initiate call. Please try again.');
      setShowCallInterface(false);
      setCurrentBusiness(null);
    } finally {
      setIsCallLoading(false);
    }
  };

  const handleCloseCallInterface = () => {
    setShowCallInterface(false);
    setActiveCall(null);
    setCurrentBusiness(null);
    endCall();
  };

  const copyEmail = (email, businessName, event) => {
  if (!email || email === 'N/A') return;
  
  // Create the outreach email template
  const emailTemplate = `${email}

Subject: AI Phone Agents for ${businessName}

Hi ${businessName} team,

I wanted to reach out to introduce our AI phone agents that can help handle your customer calls 24/7. 

Our AI agents can:
- Answer customer inquiries instantly
- Schedule appointments
- Qualify leads
- Never miss a call

Would you be interested in a quick demo to see how this could help ${businessName}?

Best regards,
[Your name]`;

  navigator.clipboard.writeText(emailTemplate).then(() => {
    // Create a temporary success message
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('success');
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('success');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy email:', err);
    alert('Failed to copy email. Please try selecting and copying manually.');
  });
};

  return (
    <>
      <div className="results-table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Website</th>
              <th>Summary</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((business, index) => {
              const validUrl = getValidUrl(business.website);
              const hasValidPhone = isValidPhoneNumber(business.telephoneNumber);
              const hasValidEmail = business.emailAddress && business.emailAddress !== 'N/A';
              
              return (
                <tr key={index}>
                  <td>{business.businessName}</td>
                  <td>
                    {validUrl ? (
                      <a 
                        href={validUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        Visit Site
                      </a>
                    ) : (
                      <span className="no-data">No website</span>
                    )}
                  </td>
                  <td className="summary-cell">
                    <div className="summary-content">
                      {business.businessSummary}
                    </div>
                  </td>
                  <td className="contact-info">
                    {business.telephoneNumber && business.telephoneNumber !== 'N/A' ? (
                      <div className={!hasValidPhone ? 'text-gray-400' : ''}>
                        📞 {business.telephoneNumber}
                      </div>
                    ) : (
                      <div className="no-data">No phone</div>
                    )}
                    {hasValidEmail ? (
                      <div>✉️ {business.emailAddress}</div>
                    ) : (
                      <div className="no-data">No email</div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-button"
                        onClick={(e) => copyEmail(business.emailAddress, business.businessName, e)}
                        disabled={!hasValidEmail}
                      >
                        Copy Email
                      </button>
                      <button 
                        className={`action-button ${activeCall === business.businessName ? 'active-call' : ''}`}
                        onClick={() => handleStartCall(business)}
                        disabled={isCallLoading || (activeCall && activeCall !== business.businessName) || !hasValidPhone}
                      >
                        {isCallLoading && activeCall === business.businessName 
                          ? 'Starting Call...' 
                          : activeCall === business.businessName 
                            ? 'End Call' 
                            : 'Schedule Call'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <CallInterface
        isOpen={showCallInterface}
        onClose={handleCloseCallInterface}
        businessName={currentBusiness?.businessName}
        businessInfo={currentBusiness}
      />
    </>
  );
}

export default ResultsTable;