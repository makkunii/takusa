import React from 'react';

export default function TouchControls({ setDir }) {
  return (
    <div className="touch-controls">
      <div className="d-pad-grid">
        <div />
        <button
          className="touch-btn"
          onTouchStart={() => setDir('up', true)}
          onTouchEnd={() => setDir('up', false)}
          onMouseDown={() => setDir('up', true)}
          onMouseUp={() => setDir('up', false)}
        >
          ▲
        </button>
        <div />
        <button
          className="touch-btn"
          onTouchStart={() => setDir('left', true)}
          onTouchEnd={() => setDir('left', false)}
          onMouseDown={() => setDir('left', true)}
          onMouseUp={() => setDir('left', false)}
        >
          ◀
        </button>
        <div />
        <button
          className="touch-btn"
          onTouchStart={() => setDir('right', true)}
          onTouchEnd={() => setDir('right', false)}
          onMouseDown={() => setDir('right', true)}
          onMouseUp={() => setDir('right', false)}
        >
          ▶
        </button>
        <div />
        <button
          className="touch-btn"
          onTouchStart={() => setDir('down', true)}
          onTouchEnd={() => setDir('down', false)}
          onMouseDown={() => setDir('down', true)}
          onMouseUp={() => setDir('down', false)}
        >
          ▼
        </button>
        <div />
      </div>
    </div>
  );
}