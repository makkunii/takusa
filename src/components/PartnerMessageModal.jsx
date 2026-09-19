import React from 'react';

export default function PartnerMessageModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: '90%', maxWidth: '400px' }}>
      <div className="victory-card animate-pop" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', border: '2px solid #f43f5e', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', borderRadius: '16px', padding: '20px' }}>
        
        {/* Envelope Icon Header */}
        <div style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '8px' }}>
          💌
        </div>

        <h2 className="victory-title" style={{ color: '#f43f5e', textAlign: 'center', fontSize: '1rem', marginBottom: '12px' }}>
          A Special Note For You
        </h2>
        
        <p className="victory-message" style={{ lineHeight: '1.6', fontSize: '0.8rem', marginBottom: '12px', color: '#334155', textAlign: 'center' }}>
          "Thank you for being my safe space, my daily inspiration, and my greatest adventure. No matter where life takes us between Cabanatuan and Bataan, my heart always finds its way back to you. I love you so much!", this world will expand more in the future a reflection of our story.
        </p>

        <div className="signature" style={{ fontStyle: 'italic', color: '#f43f5e', fontWeight: 'bold', marginBottom: '16px', fontSize: '0.85px', textAlign: 'center' }}>
          — Makkunii 💖
        </div>

        <div className="btn-group" style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            className="btn-primary" 
            onClick={onClose}
            style={{ backgroundColor: '#f43f5e', boxShadow: '0 3px 0 #be123c', padding: '8px 16px', fontSize: '0.8rem' }}
          >
            Continue to Celebration ✨
          </button>
        </div>
      </div>
    </div>
  );
}