import React, { useState, useEffect } from 'react';

const GameBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMatch = (matchedSquares) => {
    // ...istniejący kod do usuwania dopasowanych kwadratów...
    setIsAnimating(true);
    setTimeout(() => {
      // ...istniejący kod do wstawiania nowych kwadratów...
      setIsAnimating(false);
    }, 500); // 500ms opóźnienie
  };

  return (
    <div className={`game-board ${isAnimating ? 'animating' : ''}`}>
      {/* ...istniejący kod do renderowania planszy... */}
    </div>
  );
};

export default GameBoard;
