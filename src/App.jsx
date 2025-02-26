import { useState, useEffect } from 'react';
import './App.css';

const BOARD_SIZE = 8;
const COLORS = ['red', 'blue', 'green', 'yellow', 'purple'];

const App = () => {
  const [board, setBoard] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [matches, setMatches] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => COLORS[Math.floor(Math.random() * COLORS.length)])
    );
    setBoard(newBoard);
  };

  const handleSquareClick = (row, col) => {
    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      if (Math.abs(selectedRow - row) + Math.abs(selectedCol - col) === 1) {
        const newBoard = [...board];
        [newBoard[selectedRow][selectedCol], newBoard[row][col]] = [newBoard[row][col], newBoard[selectedRow][selectedCol]];
        setBoard(newBoard);
        setSelectedSquare(null);
        resolveMatches(newBoard);
      } else {
        setSelectedSquare([row, col]);
      }
    } else {
      setSelectedSquare([row, col]);
    }
  };

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
    dropSquares(newBoard);
  };

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

  const checkGameOver = () => {
    // Implement logic to check if there are no more valid moves
    // If no valid moves, setGameOver(true);
  };

  useEffect(() => {
    checkGameOver();
  }, [board]);

  return (
    <div className="App">
      <h1>Match-3 Game</h1>
      <div className="score">Score: {score}</div>
      {gameOver && <div className="game-over">Game Over!</div>}
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((color, colIndex) => (
              <div
                key={colIndex}
                className={`square ${color}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
