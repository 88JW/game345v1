import React from 'react';

const ScorePanel = ({ score, gameOver }) => {
  return (
    <div className="score-container">
      <div className="score">Wynik: {score}</div>
      {gameOver && <div className="game-over">Koniec gry!</div>}
    </div>
  );
};

export default ScorePanel;
