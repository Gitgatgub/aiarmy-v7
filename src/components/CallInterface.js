import React, { useEffect, useState } from 'react';
import AudioVisualizer from './AudioVisualizer';
import { endCall } from '../services/vapiService';

const CallInterface = ({ isOpen, onClose, businessName, businessInfo }) => {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callStatus, setCallStatus] = useState('connecting');

  useEffect(() => {
    if (!isOpen) return;

    const vapi = window.vapi;
    if (!vapi) return;

    const handleVolumeLevel = (event) => {
      setVolumeLevel(event.detail.volume || 0);
    };

    const handleCallStart = () => {
      setCallStatus('connected');
    };

    const handleCallEnd = () => {
      setCallStatus('ended');
      setTimeout(() => {
        onClose();
      }, 1000);
    };

    window.addEventListener('vapi:volume-level', handleVolumeLevel);
    window.addEventListener('vapi:call-start', handleCallStart);
    window.addEventListener('vapi:call-end', handleCallEnd);
    window.addEventListener('vapiCallEnded', handleCallEnd);

    const mockVolumeAnimation = setInterval(() => {
      if (callStatus === 'connected') {
        setVolumeLevel(Math.random() * 0.8 + 0.2);
      }
    }, 100);

    return () => {
      window.removeEventListener('vapi:volume-level', handleVolumeLevel);
      window.removeEventListener('vapi:call-start', handleCallStart);
      window.removeEventListener('vapi:call-end', handleCallEnd);
      window.removeEventListener('vapiCallEnded', handleCallEnd);
      clearInterval(mockVolumeAnimation);
    };
  }, [isOpen, callStatus, onClose]);

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  if (!isOpen) return null;

  const getAvatarImage = (businessInfo) => {
    return '/AVATARS/avatar5.png';
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Call in progress';
      case 'ended':
        return 'Call ended';
      default:
        return 'Initializing...';
    }
  };

  return (
    <div className="call-interface-overlay">
      <div className="call-interface-modal">
        <div className="call-interface-header">
          <h2>Calling {businessName}</h2>
          <p className="call-status">{getStatusText()}</p>
        </div>
        
        <div className="call-interface-content">
          <div className="avatar-section">
            <img 
              src={getAvatarImage(businessInfo)} 
              alt="Contact avatar"
              className="call-avatar"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNSA4MEMyNSA2OC45NTQzIDMzLjk1NDMgNjAgNDUgNjBINTVDNjYuMDQ1NyA2MCA3NSA2OC45NTQzIDc1IDgwVjkwSDI1VjgwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
              }}
            />
          </div>
          
          <div className="audio-visualizer-section">
            <AudioVisualizer volumeLevel={volumeLevel} />
          </div>
        </div>
        
        <div className="call-interface-actions">
          <button 
            className="end-call-button"
            onClick={handleEndCall}
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;