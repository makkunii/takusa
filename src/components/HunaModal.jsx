import React from 'react';

export default function HunaModal({ onClose, hunaImgSrc }) {
  return (
    <div className="overlay-screen">
      <div className="victory-card">
        <h2 className="victory-title">Huna's Ocean</h2>
        
        <div className="victory-cover-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1f2937' }}>
          <img 
            src={hunaImgSrc} 
            alt="Huna NPC" 
            style={{ width: '64px', height: '64px', imageRendering: 'pixelated' }} 
          />
        </div>

        <p className="victory-message">
          "Hey there, traveler! Keep exploring the paths, collect all the hidden love notes, and enjoy the journey around the map!"
        </p>

        <div className="btn-group">
          <button className="btn-primary" onClick={onClose}>
            Resume Quest
          </button>
        </div>
      </div>
    </div>
  );
}