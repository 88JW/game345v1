import React from 'react';

const GameBoard = ({ 
  board, 
  selectedSquare, 
  isAnimating,
  animatingSquares,
  fallingSquares,
  disappearingSquares,
  appearingSquares,
  swappingSquares,
  invalidMove,
  handleSquareClick 
}) => {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((color, colIndex) => {
            const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
            const isAnimatingSquare = animatingSquares.some(square => square.row === rowIndex && square.col === colIndex);
            const isFalling = fallingSquares.some(square => square.row === rowIndex && square.col === colIndex);
            const isDisappearing = disappearingSquares.some(square => square.row === rowIndex && square.col === colIndex);
            const isAppearing = appearingSquares.some(square => square.row === rowIndex && square.col === colIndex);
            const isSwapping = swappingSquares.some(square => square.row === rowIndex && square.col === colIndex);
            const swapStyle = isSwapping ? { '--swap-x': `${isSwapping.x * 100}%`, '--swap-y': `${isSwapping.y * 100}%` } : {};
            
            return (
              <div
                key={colIndex}
                className={`square ${color} ${isSelected && invalidMove ? 'cannot-move' : ''} ${isAnimatingSquare ? 'animating' : ''} ${isFalling ? 'falling' : ''} ${isDisappearing ? 'disappearing' : ''} ${isAppearing ? 'appearing' : ''} ${isSwapping ? 'swapping' : ''}`}
                style={swapStyle}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
