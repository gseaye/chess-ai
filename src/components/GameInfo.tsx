
import React from 'react';
import { Move } from 'chess.js';
import type { GameStatus } from '../types';

interface GameInfoProps {
  status: GameStatus;
  turn: 'w' | 'b';
  history: Move[];
  onReset: () => void;
}

export const GameInfo: React.FC<GameInfoProps> = ({ status, turn, history, onReset }) => {
  const turnText = turn === 'w' ? 'White' : 'Black';

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Game Info</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Start a new game"
        >
          New Game
        </button>
      </div>

      <div className="mb-4 p-3 bg-gray-900 rounded-md text-center">
        <p className="text-lg font-semibold">
          {status.isGameOver ? 'Game Over' : `${turnText}'s Turn`}
        </p>
        {status.message && (
          <p className="text-yellow-400 font-bold text-lg mt-1">{status.message}</p>
        )}
      </div>

      <div className="flex-grow overflow-hidden flex flex-col">
        <h3 className="text-lg font-semibold mb-2">Move History</h3>
        <div className="bg-gray-900 p-2 rounded-md flex-grow overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm">No moves yet.</p>
          ) : (
            <ol className="text-sm text-gray-300 space-y-1">
              {history
                .reduce((acc, move, i) => {
                  if (i % 2 === 0) acc.push([move]);
                  else acc[acc.length - 1].push(move);
                  return acc;
                }, [] as Move[][])
                .map((turn, i) => (
                  <li key={i} className="grid grid-cols-[20px_1fr_1fr] gap-2">
                    <span className="text-gray-500">{i + 1}.</span>
                    <span>{turn[0]?.san}</span>
                    {turn[1] && <span>{turn[1]?.san}</span>}
                  </li>
                ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};
