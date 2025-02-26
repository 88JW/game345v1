const GameRules = () => {
  return (
    <div>
      <h2>Game Rules</h2>
      <p>Match 3 or more squares of the same color to remove them from the board.</p>
      <p>Click or touch a square to select it, then click or touch an adjacent square to swap them.</p>
      <p>If the swap results in a match, the squares will be removed and new squares will fall into place.</p>
      <p>If the swap does not result in a match, the squares will revert to their original positions.</p>
      <h3>Scoring</h3>
      <p>You earn 100 points for each square removed from the board.</p>
    </div>
  );
};

export default GameRules;
