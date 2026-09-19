import React from 'react';

export default function MusicModal({ onClose, musicImgSrc, qrImgSrc }) {
  return (
    <div className="overlay-screen">
      <div className="victory-card">
        <h2 className="victory-title" style={{ color: '#10b981' }}>MUSIC CORNER</h2>
        
        <div className="victory-cover-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1f2937', padding: '12px' }}>
          <img 
            src={musicImgSrc} 
            alt="Music Icon" 
            style={{ width: '48px', height: '48px', imageRendering: 'pixelated', marginBottom: '8px' }} 
          />
          {/* Optional QR code placeholder image if you have one */}
          {qrImgSrc && (
            <img 
              src={qrImgSrc} 
              alt="Spotify QR Code" 
              style={{ width: '96px', height: '96px', border: '2px solid #374151', borderRadius: '4px' }} 
            />
          )}
        </div>

        <p className="victory-message">
          "Feeling a lil stress? listen to our playlist"
        </p>

        <div className="btn-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a 
            href="https://open.spotify.com/playlist/55lqsfhc7jfMeVAGnDzsVA?si=zMX5agEISmqCd9h4g3bk6A" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary"
            style={{ backgroundColor: '#10b981', boxShadow: '0 3px 0 #047857', textAlign: 'center', textDecoration: 'none' }}
          >
            OPEN SPOTIFY
          </a>
          <button 
            className="btn-primary" 
            onClick={onClose}
            style={{ backgroundColor: '#374151', boxShadow: '0 3px 0 #1f2937' }}
          >
            RESUME QUEST
          </button>
        </div>
      </div>
    </div>
  );
}