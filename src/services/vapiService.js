// For outbound calls (AI calls the business)
export const startCall = async (businessName, phoneNumber) => {
  try {
    // Get user settings from localStorage
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    // Check if all required settings are present
    if (!settings.vapiKey || !settings.assistantId || !settings.phoneNumberId) {
      throw new Error('Please configure your Vapi settings first. Go to Settings and add your API Key, Assistant ID, and Phone Number ID.');
    }

    // Convert phone to E.164 format
    let formattedPhone = phoneNumber.replace(/[\s\-().]/g, ''); // Remove spaces, dashes, parentheses
    
    // Add country code if not present
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.length === 10) {
        formattedPhone = '+1' + formattedPhone; // US numbers
      } else if (formattedPhone.startsWith('0')) {
        formattedPhone = '+44' + formattedPhone.substring(1); // UK numbers
      }
    }
    
    console.log('Calling number:', formattedPhone); // Debug log

    // Use Vapi API for outbound calls
    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.vapiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        assistantId: settings.assistantId,
        customer: {
          number: formattedPhone,  // Use formatted phone here
          name: businessName
        },
        phoneNumberId: settings.phoneNumberId
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to start call: ${error}`);
    }

    const data = await response.json();
    console.log('Call started:', data);
    
    // Check call status every 5 seconds
    const checkCallStatus = setInterval(async () => {
      try {
        const statusResponse = await fetch(`https://api.vapi.ai/call/${data.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${settings.vapiKey}`,
          }
        });
        
        if (statusResponse.ok) {
          const callData = await statusResponse.json();
          console.log('Call status:', callData.status);
          
          // If call has ended, clear interval and notify
          if (callData.status === 'ended' || callData.endedAt) {
            clearInterval(checkCallStatus);
            console.log('Call ended automatically');
            
            // Dispatch event to update UI
            window.dispatchEvent(new CustomEvent('vapiCallEnded', { 
              detail: { businessName, callId: data.id } 
            }));
          }
        }
      } catch (error) {
        console.error('Error checking call status:', error);
      }
    }, 5000); // Check every 5 seconds
    
    // Store interval ID and call ID so we can clear/end them if needed
    window.vapiCallInterval = checkCallStatus;
    window.vapiCallId = data.id;
    
    return data;
    
  } catch (error) {
    console.error('Error starting call:', error);
    throw error;
  }
};

export const endCall = async () => {
  try {
    // Actually end the Vapi call if we have a call ID
    if (window.vapiCallId) {
      const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      
      if (settings.vapiKey) {
        const response = await fetch(`https://api.vapi.ai/call/${window.vapiCallId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${settings.vapiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'ended'
          })
        });
        
        if (response.ok) {
          console.log('Vapi call terminated successfully');
        } else {
          console.error('Failed to terminate Vapi call:', await response.text());
        }
      }
      
      window.vapiCallId = null;
    }
    
    // Clear the status check interval if it exists
    if (window.vapiCallInterval) {
      clearInterval(window.vapiCallInterval);
      window.vapiCallInterval = null;
    }
    
    console.log('Call ended and monitoring stopped');
    
  } catch (error) {
    console.error('Error ending call:', error);
  }
};