import { useState, useEffect } from 'react';
import './App.css';
import GameRules from './GameRules';
import sounds from './soundConfig';
import rulesSound from './assets/rules_sound_1.wav';
import matchSound from './assets/blik_sound_1.wav';
import bigMatchSound from './assets/blik_sound_2.wav';

const BOARD_SIZE = 8;
const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];

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
  const [fallingSquares, setFallingSquares] = useState([]);
  const [disappearingSquares, setDisappearingSquares] = useState([]);
  const [appearingSquares, setAppearingSquares] = useState([]);
  const [swappingSquares, setSwappingSquares] = useState([]);
  const [isMuted, setIsMuted] = useState(() => {
    // Pobierz zapisany stan wyciszenia z localStorage lub ustaw domyślnie na false
    const savedMute = localStorage.getItem('isMuted');
    return savedMute ? JSON.parse(savedMute) : false;
  });

  // Zapisz stan wyciszenia w localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem('isMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    initializeBoard();
  }, []);

  // Inicjalizacja początkowej planszy
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

  // Generowanie nowych symboli po usunięciu dopasowanych elementów
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

  const playSound = (soundSrc) => {
    if (!isMuted) {
      const audio = new Audio(soundSrc);
      audio.play().catch(err => console.log("Błąd odtwarzania dźwięku:", err));
    }
  };

  const playRulesSound = () => {
    playSound(rulesSound);
  };

  const toggleMute = () => {
    setIsMuted(prevMuted => !prevMuted);
  };

  return (
    <div className={`App ${isAnimating ? 'animating' : ''}`}>
      <div className="score-container">
        <div className="score">Wynik: {score}</div>
      </div>
      {gameOver && <div className="game-over">Koniec gry!</div>}
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((color, colIndex) => {
              const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
              const isAnimating = animatingSquares.some(square => square.row === rowIndex && square.col === colIndex);
              const isFalling = fallingSquares.some(square => square.row === rowIndex && square.col === colIndex);
              const isDisappearing = disappearingSquares.some(square => square.row === rowIndex && square.col === colIndex);
              const isAppearing = appearingSquares.some(square => square.row === rowIndex && square.col === colIndex);
              const isSwapping = swappingSquares.some(square => square.row === rowIndex && square.col === colIndex);
              const swapStyle = isSwapping ? { '--swap-x': `${isSwapping.x * 100}%`, '--swap-y': `${isSwapping.y * 100}%` } : {};
              return (
                <div
                  key={colIndex}
                  className={`square ${color} ${isSelected && invalidMove ? 'cannot-move' : ''} ${isAnimating ? 'animating' : ''} ${isFalling ? 'falling' : ''} ${isDisappearing ? 'disappearing' : ''} ${isAppearing ? 'appearing' : ''} ${isSwapping ? 'swapping' : ''}`}
                  style={swapStyle}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Replace single button with button container */}
      <div className="buttons-container">
        <button
          className={`show-rules-button`}
          onClick={() => {
            playRulesSound();
            setShowRules(true);
          }}
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
      
      {showRules && (
        <div className="rules-popup">
          <div className="rules-content">
            <GameRules />
            <button onClick={() => setShowRules(false)}>Zamknij</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
