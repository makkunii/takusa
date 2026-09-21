import React, { useState, useEffect } from 'react';
import { Wind, X } from 'lucide-react';

export default function VapeModal({ onClose, vapePhotoImgSrc }) {
  const [timeLeft, setTimeLeft] = useState(3);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanClose(true);
    }
  }, [timeLeft]);

  return (
    <div className="overlay-screen">
      <div className="victory-card">
        {vapePhotoImgSrc && (
          <div className="victory-cover-wrapper">
            <img src={vapePhotoImgSrc} alt="Vape Lounge" className="victory-cover-image" />
          </div>
        )}

        <h2 className="victory-title" style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Wind size={14} /> Cloud City Vaping Room
        </h2>
        
        <p className="victory-message">
          "Taking a quick chill break at the e-juice lab. Good vibes, smooth clouds, and great company!"
        </p>

        <button
          onClick={onClose}
          disabled={!canClose}
          className="btn-primary"
          style={{ 
            backgroundColor: canClose ? '#06b6d4' : '#cbd5e1', 
            boxShadow: canClose ? '0 3px 0 #0891b2' : '0 3px 0 #94a3b8',
            cursor: canClose ? 'pointer' : 'not-allowed'
          }}
        >
          <X size={12} /> {canClose ? "RESUME EXPLORING" : `Please wait (${timeLeft}s)...`}
        </button>
      </div>
    </div>
  );
}