import { useState, useEffect } from 'react';
import './App.css';

const BOARD_SIZE = 8;
const COLORS = ['red', 'blue', 'green', 'yellow', 'purple'];

const App = () => {
  const [board, setBoard] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [matches, setMatches] = useState([]);
  const [matchTimer, setMatchTimer] = useState(null);
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
        resolveMatches();
      } else {
        setSelectedSquare([row, col]);
      }
    } else {
      setSelectedSquare([row, col]);
    }
  };

  const resolveMatches = () => {
    const newMatches = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const color = board[row][col];
        if (col < BOARD_SIZE - 2 && board[row][col + 1] === color && board[row][col + 2] === color) {
          newMatches.push({ row, col });
          newMatches.push({ row, col: col + 1 });
          newMatches.push({ row, col: col + 2 });
        }
        if (row < BOARD_SIZE - 2 && board[row + 1][col] === color && board[row + 2][col] === color) {
          newMatches.push({ row, col });
          newMatches.push({ row: row + 1, col });
          newMatches.push({ row: row + 2, col });
        }
      }
    }
    if (newMatches.length > 0) {
      setMatches(newMatches);
      if (matchTimer) clearTimeout(matchTimer);
      setMatchTimer(setTimeout(() => {
        removeMatches();
      }, 1000));
    }
  };

  const removeMatches = () => {
    const newBoard = [...board];
    let points = 0;
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = null;
      points += 100;
    });
    setBoard(newBoard);
    setMatches([]);
    setScore(score + points);
    dropSquares();
  };

  const dropSquares = () => {
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
    generateNewSquares();
  };

  const generateNewSquares = () => {
    const newBoard = [...board];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col] === null) {
          newBoard[row][col] = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
      }
    }
    setBoard(newBoard);
    resolveMatches();
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
