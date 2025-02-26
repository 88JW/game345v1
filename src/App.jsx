import { useState, useEffect } from 'react';
import './App.css';
import GameRules from './GameRules';

const BOARD_SIZE = 8;
const COLORS = ['red', 'blue', 'green', 'yellow', 'purple'];

const App = () => {
  const [board, setBoard] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [matches, setMatches] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [invalidMove, setInvalidMove] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingSquares, setAnimatingSquares] = useState([]);

  useEffect(() => {
    initializeBoard();
  }, []);

  // Inicjalizuje planszę z losowymi kolorami
  const initializeBoard = () => {
    const newBoard = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => COLORS[Math.floor(Math.random() * COLORS.length)])
    );
    setBoard(newBoard);
  };

  // Obsługuje kliknięcie na kwadrat
  const handleSquareClick = (row, col) => {
    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      if (Math.abs(selectedRow - row) + Math.abs(selectedCol - col) === 1) {
        const newBoard = [...board];
        [newBoard[selectedRow][selectedCol], newBoard[row][col]] = [newBoard[row][col], newBoard[selectedRow][selectedCol]];
        if (hasMatches(newBoard)) {
          setBoard(newBoard);
          setSelectedSquare(null);
          setInvalidMove(false);
          resolveMatches(newBoard);
        } else {
          // Cofnij zamianę, jeśli nie znaleziono dopasowań
          [newBoard[selectedRow][selectedCol], newBoard[row][col]] = [newBoard[row][col], newBoard[selectedRow][selectedCol]];
          setSelectedSquare(null);
          setInvalidMove(true);
        }
      } else {
        setSelectedSquare([row, col]);
        setInvalidMove(false);
      }
    } else {
      setSelectedSquare([row, col]);
      setInvalidMove(false);
    }
  };

  // Sprawdza, czy na planszy są dopasowania
  const hasMatches = (board) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const color = board[row][col];
        if (col < BOARD_SIZE - 2 && board[row][col + 1] === color && board[row][col + 2] === color) {
          return true;
        }
        if (row < BOARD_SIZE - 2 && board[row + 1][col] === color && board[row + 2][col] === color) {
          return true;
        }
      }
    }
    return false;
  };

  // Znajduje i oznacza dopasowania na planszy
  const resolveMatches = (board) => {
    const newMatches = [];
    const matchMap = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const color = board[row][col];
        if (col < BOARD_SIZE - 2 && board[row][col + 1] === color && board[row][col + 2] === color) {
          matchMap[row][col] = true;
          matchMap[row][col + 1] = true;
          matchMap[row][col + 2] = true;
        }
        if (row < BOARD_SIZE - 2 && board[row + 1][col] === color && board[row + 2][col] === color) {
          matchMap[row][col] = true;
          matchMap[row + 1][col] = true;
          matchMap[row + 2][col] = true;
        }
      }
    }

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (matchMap[row][col]) {
          newMatches.push({ row, col });
        }
      }
    }

    if (newMatches.length > 0) {
      setMatches(newMatches);
      removeMatches(newMatches);
    }
  };

  // Usuwa dopasowania z planszy
  const removeMatches = (matches) => {
    const newBoard = [...board];
    let points = 0;
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = null;
      points += 100;
    });
    setBoard(newBoard);
    setMatches([]);
    setScore(score + points);
    setAnimatingSquares(matches);
    setTimeout(() => {
      dropSquares(newBoard);
      setAnimatingSquares([]);
    }, 500); // 500ms delay
  };

  // Przesuwa kwadraty w dół, aby wypełnić puste miejsca
  const dropSquares = (board) => {
    const newBoard = [...board];
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (newBoard[row][col] === null) {
          for (let rowAbove = row - 1; rowAbove >= 0; rowAbove--) {
            if (newBoard[rowAbove][col] !== null) {
              newBoard[row][col] = newBoard[rowAbove][col];
              newBoard[rowAbove][col] = null;
              break;
            }
          }
        }
      }
    }
    setBoard(newBoard);
    generateNewSquares(newBoard);
  };

  // Generuje nowe kwadraty w pustych miejscach
  const generateNewSquares = (board) => {
    const newBoard = [...board];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col] === null) {
          newBoard[row][col] = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
      }
    }
    setBoard(newBoard);
    resolveMatches(newBoard);
  };

  // Sprawdza, czy gra się skończyła
  const checkGameOver = () => {
    // Implement logic to check if there are no more valid moves
    // If no valid moves, setGameOver(true);
  };

  useEffect(() => {
    checkGameOver();
  }, [board]);

  return (
    <div className={`App ${isAnimating ? 'animating' : ''}`}>
      <h1>Game 3-4-5</h1>
      <div className="score">Score: {score}</div>
      {gameOver && <div className="game-over">Game Over!</div>}
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((color, colIndex) => {
              const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
              const isAnimating = animatingSquares.some(square => square.row === rowIndex && square.col === colIndex);
              return (
                <div
                  key={colIndex}
                  className={`square ${color} ${isSelected && invalidMove ? 'cannot-move' : ''} ${isAnimating ? 'animating' : ''}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <button className="show-rules-button" onClick={() => setShowRules(true)}>Show Rules</button>
      {showRules && (
        <div className="rules-popup">
          <div className="rules-content">
            <GameRules />
            <button onClick={() => setShowRules(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
