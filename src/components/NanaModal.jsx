import React from 'react';

export default function NanaModal({ onClose, nanaImgSrc }) {
  return (
    <div className="overlay-screen">
      <div className="victory-card" style={{ borderColor: '#ec4899', boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)' }}>
        <h2 className="victory-title" style={{ color: '#ec4899' }}>Nana's Magic Support</h2>
        
        <div className="victory-cover-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1f2937', borderColor: '#ec4899' }}>
          <img 
            src={nanaImgSrc} 
            alt="Nana NPC" 
            style={{ width: '64px', height: '64px', imageRendering: 'pixelated' }} 
          />
        </div>

        <p className="victory-message">
          <em>"Molina, attack!"</em><br /><br />
          You found Nana chilling on the map! Keep, collecting hearts, and watch out for CC spells out there. ✨🐰
        </p>

        <div className="btn-group">
          <button 
            className="btn-primary" 
            onClick={onClose}
            style={{ backgroundColor: '#ec4899', boxShadow: '0 3px 0 #be185d' }}
          >
            Thanks, Nana!
          </button>
        </div>
      </div>
    </div>
  );
}