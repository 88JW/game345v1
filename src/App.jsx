import { useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import ScorePanel from './components/ScorePanel';
import Controls from './components/Controls';
import RulesModal from './components/RulesModal';
import { useGameLogic } from './hooks/useGameLogic';
import { useSoundManager } from './hooks/useSoundManager';
import rulesSound from './assets/rules_sound_1.wav';
import matchSound from './assets/blik_sound_1.wav';
import bigMatchSound from './assets/blik_sound_2.wav';

const App = () => {
  const [showRules, setShowRules] = useState(false);
  
  const { isMuted, playSound, toggleMute } = useSoundManager();
  
  const {
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
  } = useGameLogic(playSound, matchSound, bigMatchSound);

  const handleShowRules = () => {
    playSound(rulesSound);
    setShowRules(true);
  };

  return (
    <div className={`App ${isAnimating ? 'animating' : ''}`}>
      <ScorePanel score={score} gameOver={gameOver} />
      
      <GameBoard
        board={board}
        selectedSquare={selectedSquare}
        isAnimating={isAnimating}
        animatingSquares={animatingSquares}
        fallingSquares={fallingSquares}
        disappearingSquares={disappearingSquares}
        appearingSquares={appearingSquares}
        swappingSquares={swappingSquares}
        invalidMove={invalidMove}
        handleSquareClick={handleSquareClick}
      />
      
      <Controls
        isMuted={isMuted}
        toggleMute={toggleMute}
        showRules={handleShowRules}
      />
      
      <RulesModal 
        isOpen={showRules} 
        onClose={() => setShowRules(false)} 
      />
    </div>
  );
};

export default App;
