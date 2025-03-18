import React from 'react';
import GameRules from '../GameRules';

const RulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="rules-popup">
      <div className="rules-content">
        <GameRules />
        <button onClick={onClose}>Zamknij</button>
      </div>
    </div>
  );
};

export default RulesModal;
