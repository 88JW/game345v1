import React from 'react';

const Controls = ({ isMuted, toggleMute, showRules }) => {
  return (
    <div className="buttons-container">
      <button
        className="show-rules-button"
        onClick={showRules}
      >
        Pokaż zasady
      </button>
      <button 
        className={`round-button ${isMuted ? 'muted' : ''}`}
        onClick={toggleMute}
        aria-label={isMuted ? "Włącz dźwięk" : "Wycisz dźwięk"}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
};

export default Controls;
