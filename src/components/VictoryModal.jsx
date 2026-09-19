import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function VictoryModal({ playerChar, hearts, startGame, goToCharSelect, coverImgSrc }) {
  return (
    <div className="overlay-screen">
      <div className="victory-card">
        <div className="victory-cover-wrapper">
          <img src={coverImgSrc} alt="Together Forever" className="victory-cover-image" />
        </div>

        <h2 className="victory-title">YOU FOUND ME! ❤️</h2>
        <p className="victory-message">
          {playerChar === 'makkunii'
            ? 'Makkunii explored the entire pixel world and collected all the love notes to reunite with Dang!'
            : 'Dang explored every corner of the pixel forest to find Makkunii!'}
        </p>
        <div style={{ fontSize: '9px', color: '#f59e0b', marginBottom: '16px' }}>
          LOVE NOTES COLLECTED: {hearts}
        </div>

        <div className="btn-group">
          <button onClick={startGame} className="btn-primary">
            <Sparkles size={14} /> REPLAY QUEST
          </button>
          <button onClick={goToCharSelect} className="btn-secondary">
            <ArrowLeft size={14} /> CHANGE HERO
          </button>
        </div>
      </div>
    </div>
  );
}