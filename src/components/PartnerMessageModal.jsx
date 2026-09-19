import React, { useState, useEffect } from 'react';

export default function PartnerMessageModal({ onClose }) {
  const [timeLeft, setTimeLeft] = useState(5);
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="victory-card animate-pop" style={{ 
        background: '#fff', 
        border: '2px solid #f43f5e', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)', 
        borderRadius: '16px', 
        padding: '24px',
        maxWidth: '420px',
        width: '90%',
        textAlign: 'center'
      }}>
        
        {/* Envelope Icon Header */}
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
          💌
        </div>

        <h2 className="victory-title" style={{ color: '#f43f5e', fontSize: '1.1rem', marginBottom: '12px' }}>
          A Special Note For You
        </h2>
        
        <p className="victory-message" style={{ lineHeight: '1.6', fontSize: '0.85rem', marginBottom: '12px', color: '#334155' }}>
          "Thank you for being my safe space, my daily inspiration, and my greatest adventure. No matter where life takes us between Cabanatuan and Bataan, my heart always finds its way back to you. I love you so much!"
        </p>

        <div className="signature" style={{ fontStyle: 'italic', color: '#f43f5e', fontWeight: 'bold', marginBottom: '20px', fontSize: '0.9rem' }}>
          — Makkunii 💖
        </div>

        <div className="btn-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn-primary" 
            onClick={onClose}
            disabled={!canClose}
            style={{ 
              backgroundColor: canClose ? '#f43f5e' : '#cbd5e1', 
              boxShadow: canClose ? '0 3px 0 #be123c' : '0 3px 0 #94a3b8', 
              padding: '10px 20px', 
              fontSize: '0.85rem',
              cursor: canClose ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.3s ease'
            }}
          >
            {canClose ? "Continue to Celebration ✨" : `Please wait (${timeLeft}s)...`}
          </button>
        </div>
      </div>
    </div>
  );
}