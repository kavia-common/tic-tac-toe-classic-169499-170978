import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './App.css';

/**
 * Ocean Professional themed Tic Tac Toe App
 * - Accessible: ARIA roles, keyboard operable squares, focus rings
 * - Responsive: centered board with fluid layout
 * - Game logic: alternating turns, win/draw detection, move history with jump, reset
 * - Minimal state with React hooks
 */

// Helper: winning combinations
const WIN_LINES = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // cols
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonals
  [2, 4, 6],
];

// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /** Determine winner and winning line for highlighting */
  for (const [a, b, c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

// PUBLIC_INTERFACE
function Square({ value, onClick, index, disabled, isWinning, isNextX }) {
  /** A single square; button for accessibility. */
  const label = value
    ? `Cell ${index + 1}, ${value}`
    : `Cell ${index + 1}, empty. Place ${isNextX ? 'X' : 'O'} here`;

  return (
    <button
      type="button"
      className={`ttt-square ${isWinning ? 'ttt-square--winning' : ''}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={!!value}
      role="button"
      disabled={disabled || !!value}
      data-cell-index={index}
    >
      <span className="ttt-square__content" aria-hidden="true">
        {value}
      </span>
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine, isGameOver, isNextX }) {
  /** 3x3 game board, centered grid */
  return (
    <div
      className="ttt-board"
      role="grid"
      aria-label="Tic Tac Toe Board"
      aria-rowcount={3}
      aria-colcount={3}
    >
      {squares.map((val, idx) => {
        const isWinning = winningLine.includes(idx);
        return (
          <div
            key={idx}
            role="gridcell"
            aria-rowindex={Math.floor(idx / 3) + 1}
            aria-colindex={(idx % 3) + 1}
            className="ttt-board__cell"
          >
            <Square
              value={val}
              index={idx}
              onClick={() => onSquareClick(idx)}
              disabled={isGameOver}
              isWinning={isWinning}
              isNextX={isNextX}
            />
          </div>
        );
      })}
    </div>
  );
}

// PUBLIC_INTERFACE
function MoveHistory({ history, jumpTo, currentStep }) {
  /** Optional: move history to jump to any move */
  return (
    <div className="ttt-history" aria-live="polite">
      <h3 className="ttt-subtitle">Move History</h3>
      <ol className="ttt-history__list">
        {history.map((_, move) => {
          const desc = move ? `Go to move #${move}` : 'Go to game start';
          const isCurrent = move === currentStep;
          return (
            <li key={move}>
              <button
                type="button"
                className={`btn btn-secondary btn-sm ${isCurrent ? 'btn-active' : ''}`}
                onClick={() => jumpTo(move)}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {desc}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root app with Ocean Professional theme and full game logic */
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const currentSquares = history[stepNumber];

  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(currentSquares),
    [currentSquares]
  );

  const isBoardFull = useMemo(
    () => currentSquares.every(Boolean),
    [currentSquares]
  );

  const isDraw = !winner && isBoardFull;
  const isGameOver = Boolean(winner) || isDraw;

  const status = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "It's a draw!";
    return `Next player: ${xIsNext ? 'X' : 'O'}`;
  }, [winner, isDraw, xIsNext]);

  const onSquareClick = useCallback(
    (index) => {
      if (isGameOver || currentSquares[index]) return;

      const newSquares = currentSquares.slice();
      newSquares[index] = xIsNext ? 'X' : 'O';

      const nextHistory = history.slice(0, stepNumber + 1).concat([newSquares]);
      setHistory(nextHistory);
      setStepNumber(nextHistory.length - 1);
      setXIsNext((prev) => !prev);
    },
    [isGameOver, currentSquares, xIsNext, history, stepNumber]
  );

  const resetGame = useCallback(() => {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setXIsNext(true);
  }, []);

  const jumpTo = useCallback(
    (move) => {
      setStepNumber(move);
      setXIsNext(move % 2 === 0);
    },
    []
  );

  // Apply Ocean Professional background on body
  useEffect(() => {
    document.body.classList.add('ocean-bg');
    return () => document.body.classList.remove('ocean-bg');
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="title">Tic Tac Toe</h1>
        <p className="subtitle">Two-player classic, Ocean Professional theme</p>
      </header>

      <main className="app-main">
        <section className="game-card" aria-label="Tic Tac Toe Game">
          <div className="status-row">
            <div
              className={`status-badge ${winner ? 'status-badge--win' : isDraw ? 'status-badge--draw' : 'status-badge--info'}`}
              role="status"
              aria-live="polite"
            >
              {status}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={resetGame}
              aria-label="Start a new game"
            >
              New Game
            </button>
          </div>

          <Board
            squares={currentSquares}
            onSquareClick={onSquareClick}
            winningLine={winningLine}
            isGameOver={isGameOver}
            isNextX={xIsNext}
          />

          <MoveHistory history={history} jumpTo={jumpTo} currentStep={stepNumber} />
        </section>
      </main>

      <footer className="app-footer">
        <span className="footer-text">Ocean Professional • #2563EB / #F59E0B</span>
      </footer>
    </div>
  );
}

export default App;
