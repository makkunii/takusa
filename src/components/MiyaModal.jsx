import React from 'react';

export default function MiyaModal({ onClose, miyaImgSrc }) {
  return (
    <div className="overlay-screen">
      <div className="victory-card">
        <h2 className="victory-title" style={{ color: '#a855f7' }}>Miya's Corner</h2>
        
        <div className="victory-cover-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1f2937' }}>
          <img 
            src={miyaImgSrc} 
            alt="Miya NPC" 
            style={{ width: '64px', height: '64px', imageRendering: 'pixelated' }} 
          />
        </div>

        <p className="victory-message">
          "Feel free to go back to the land of dawn."
        </p>

        <div className="btn-group">
          <button 
            className="btn-primary" 
            onClick={onClose}
            style={{ backgroundColor: '#a855f7', boxShadow: '0 3px 0 #7e22ce' }}
          >
            Resume Quest
          </button>
        </div>
      </div>
    </div>
  );
}