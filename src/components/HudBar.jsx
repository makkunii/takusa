import React from 'react';
import { Volume2, VolumeX, UserCheck, Heart } from 'lucide-react';

export default function HudBar({ muted, toggleAudio, gameState, goToCharSelect, hearts }) {
  return (
    <div className="top-bar">
      <div className="hud-actions">
        <button onClick={toggleAudio} className="icon-button">
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        {gameState === 'PLAYING' && (
          <button onClick={goToCharSelect} className="icon-button">
            <UserCheck size={14} /> SWITCH HERO
          </button>
        )}
      </div>

      <div className="hud-info" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Heart size={14} color="#f43f5e" fill="#f43f5e" />
        <span>LOVE NOTES: {hearts}/5</span>
      </div>
    </div>
  );
}