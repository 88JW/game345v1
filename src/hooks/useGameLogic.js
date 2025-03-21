import { useState, useEffect } from 'react';

const BOARD_SIZE = 8;
const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];

export const useGameLogic = (playSound, matchSound, bigMatchSound) => {
  const [board, setBoard] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [matches, setMatches] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [invalidMove, setInvalidMove] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingSquares, setAnimatingSquares] = useState([]);
  const [fallingSquares, setFallingSquares] = useState([]);
  const [disappearingSquares, setDisappearingSquares] = useState([]);
  const [appearingSquares, setAppearingSquares] = useState([]);
  const [swappingSquares, setSwappingSquares] = useState([]);

  useEffect(() => {
    initializeBoard();
  }, []);

  // Inicjalizacja planszy
  const initializeBoard = () => {
    const newBoard = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => COLORS[Math.floor(Math.random() * COLORS.length)])
    );
    setBoard(newBoard);
  };

  const handleSquareClick = (row, col) => {
    if (isAnimating) return;
    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      if (Math.abs(selectedRow - row) + Math.abs(selectedCol - col) === 1) {
        const newBoard = [...board];
        [newBoard[selectedRow][selectedCol], newBoard[row][col]] = [newBoard[row][col], newBoard[selectedRow][selectedCol]];
        const swapDirection = {
          x: col - selectedCol,
          y: row - selectedRow
        };
        setSwappingSquares([{ row: selectedRow, col: selectedCol, ...swapDirection }, { row, col, ...swapDirection }]);
        setIsAnimating(true);
        setTimeout(() => {
          if (hasMatches(newBoard)) {
            setBoard(newBoard);
            setSelectedSquare(null);
            setInvalidMove(false);
            resolveMatches(newBoard);
          } else {
            [newBoard[selectedRow][selectedCol], newBoard[row][col]] = [newBoard[row][col], newBoard[selectedRow][selectedCol]];
            setBoard(newBoard);
            setSelectedSquare(null);
            setInvalidMove(true);
          }
          setSwappingSquares([]);
          setIsAnimating(false);
        }, 300);
      } else {
        setSelectedSquare([row, col]);
        setInvalidMove(false);
      }
    } else {
      setSelectedSquare([row, col]);
      setInvalidMove(false);
    }
  };

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
      setDisappearingSquares(newMatches);
      const soundToPlay = newMatches.length > 3 ? bigMatchSound : matchSound;
      playSound(soundToPlay);
      setTimeout(() => {
        removeMatches(newMatches);
        setDisappearingSquares([]);
      }, 500);
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
    setScore(prevScore => prevScore + points);
    setAnimatingSquares(matches);
    setTimeout(() => {
      dropSquares(newBoard);
      setAnimatingSquares([]);
    }, 500);
  };

  const dropSquares = (board) => {
    const newBoard = [...board];
    const newFallingSquares = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (newBoard[row][col] === null) {
          for (let rowAbove = row - 1; rowAbove >= 0; rowAbove--) {
            if (newBoard[rowAbove][col] !== null) {
              newBoard[row][col] = newBoard[rowAbove][col];
              newBoard[rowAbove][col] = null;
              newFallingSquares.push({ row, col });
              break;
            }
          }
        }
      }
    }
    setBoard(newBoard);
    setFallingSquares(newFallingSquares);
    setTimeout(() => {
      setFallingSquares([]);
      generateNewSquares(newBoard);
    }, 500);
  };

  const generateNewSquares = (board) => {
    const newBoard = [...board];
    const newAppearingSquares = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col] === null) {
          newBoard[row][col] = COLORS[Math.floor(Math.random() * COLORS.length)];
          newAppearingSquares.push({ row, col });
        }
      }
    }
    setBoard(newBoard);
    setAppearingSquares(newAppearingSquares);
    setIsAnimating(true);
    setTimeout(() => {
      setAppearingSquares([]);
      resolveMatches(newBoard);
      setIsAnimating(false);
    }, 500);
  };

  const checkGameOver = () => {
    // Implement game over logic
  };

  useEffect(() => {
    checkGameOver();
  }, [board]);

  return {
    board,
    selectedSquare,
    score,
    gameOver,
    invalidMove,
    isAnimating,
    animatingSquares,
    fallingSquares,
    disappearingSquares,
    appearingSquares,
    swappingSquares,
    handleSquareClick
  };
};