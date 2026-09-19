import React from 'react';
import { Coffee, X } from 'lucide-react';

export default function CoffeeModal({ onClose, coffeePhotoImgSrc }) {
  return (
    <div className="overlay-screen">
      <div className="victory-card">
        <div className="victory-cover-wrapper">
          <img src={coffeePhotoImgSrc} alt="Coffee Date" className="victory-cover-image" />
        </div>

        <h2 className="victory-title" style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Coffee size={14} /> Our First Meetup
        </h2>
        <p className="victory-message">Taking a cozy coffee break together in real life!</p>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ backgroundColor: '#f59e0b', boxShadow: '0 3px 0 #b45309' }}
        >
          <X size={12} /> RESUME EXPLORING
        </button>
      </div>
    </div>
  );
}