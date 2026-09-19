import React from 'react';

export default function CharacterCard({ charKey, name, targetLabel, imgSrc, selected, onSelect }) {
  return (
    <div
      className={`char-card ${selected ? `selected-${charKey}` : ''}`}
      onClick={onSelect}
    >
      <div className="char-avatar-wrapper">
        <img src={imgSrc} alt={name} />
      </div>
      <span className="char-name">{name}</span>
      <span className="target-label">{targetLabel}</span>
    </div>
  );
}