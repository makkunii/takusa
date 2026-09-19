import React from 'react';

export default function ZakyModal({ onClose, zakyImgSrc }) {
  return (
    <div className="overlay-screen">
      <div className="victory-card">
        <h2 className="victory-title" style={{ color: '#3b82f6' }}>Zaky's Universe</h2>
        
        <div className="victory-cover-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1f2937' }}>
          <img 
            src={zakyImgSrc} 
            alt="Zaky NPC" 
            style={{ width: '64px', height: '64px', imageRendering: 'pixelated' }} 
          />
        </div>

        <p className="victory-message">
          "You two met in my world... I guess it's finally time you meet in yours."
        </p>

        <div className="btn-group">
          <button 
            className="btn-primary" 
            onClick={onClose}
            style={{ backgroundColor: '#3b82f6', boxShadow: '0 3px 0 #1d4ed8' }}
          >
            Resume Quest
          </button>
        </div>
      </div>
    </div>
  );
}