import React from 'react';
import { Play } from 'lucide-react';
import CharacterCard from './characters/CharacterCard';

export default function StartScreen({ playerChar, setPlayerChar, startGame, assetsLoaded, makkuniiImgSrc, dangImgSrc }) {
  return (
    <div className="overlay-screen">
      <h1 className="title">A World With You</h1>
      <p className="subtitle">EXPLORE THE MAP TO FIND YOUR PARTNER</p>

      <div className="char-select-container">
        <CharacterCard
          charKey="makkunii"
          name="MAKKUNII"
          targetLabel="Find Dang"
          imgSrc={makkuniiImgSrc}
          selected={playerChar === 'makkunii'}
          onSelect={() => setPlayerChar('makkunii')}
        />

        <CharacterCard
          charKey="dang"
          name="DANG"
          targetLabel="Find Makkunii"
          imgSrc={dangImgSrc}
          selected={playerChar === 'dang'}
          onSelect={() => setPlayerChar('dang')}
        />
      </div>

      <button onClick={startGame} className="btn-primary" disabled={!assetsLoaded}>
        <Play size={14} /> {assetsLoaded ? 'START EXPLORING' : 'LOADING ASSETS...'}
      </button>
      <span className="controls-hint">WALK WITH W/A/S/D OR ARROW KEYS</span>
    </div>
  );
}