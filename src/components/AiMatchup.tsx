
import React from 'react';
import { AVAILABLE_MODELS } from '../constants';
import { Model, ModelFamily } from '../types';
import { Move } from 'chess.js';

interface AiMatchupProps {
  whitePlayerModel: Model;
  blackPlayerModel: Model;
  onWhitePlayerModelChange: (model: Model) => void;
  onBlackPlayerModelChange: (model: Model) => void;
  onMakeAiMove: () => void;
  isAiThinking: boolean;
  isGameOver: boolean;
  aiError: string | null;
  lastResponseTimes: { w: number; b: number };
  totalResponseTimes: { w: number; b: number };
  lastMoves: { w: Move | null; b: Move | null };
  turn: 'w' | 'b';
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const AiMatchup: React.FC<AiMatchupProps> = ({
  whitePlayerModel,
  blackPlayerModel,
  onWhitePlayerModelChange,
  onBlackPlayerModelChange,
  onMakeAiMove,
  isAiThinking,
  isGameOver,
  aiError,
  lastResponseTimes,
  totalResponseTimes,
  lastMoves,
  turn,
  isAutoPlaying,
  onToggleAutoPlay,
}) => {
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>, player: 'white' | 'black') => {
    const selectedModel = AVAILABLE_MODELS.find(m => m.id === e.target.value);
    if (selectedModel) {
      if (player === 'white') {
        onWhitePlayerModelChange(selectedModel);
      } else {
        onBlackPlayerModelChange(selectedModel);
      }
    }
  };

  const formatTime = (ms: number) => `${(ms / 1000).toFixed(2)}s`;

  const groupedModels = AVAILABLE_MODELS.reduce((acc, model) => {
    const family = model.family;
    if (!acc[family]) {
      acc[family] = [];
    }
    acc[family].push(model);
    return acc;
  }, {} as Record<ModelFamily, Model[]>);

  const renderOptions = () => {
    return Object.entries(groupedModels).map(([family, models]) => (
      <optgroup key={family} label={family.charAt(0).toUpperCase() + family.slice(1)}>
        {models.map(model => (
          <option key={model.id} value={model.id}>{model.name}</option>
        ))}
      </optgroup>
    ));
  };

  const PlayerStats: React.FC<{ color: 'w' | 'b' }> = ({ color }) => {
    const isActive = turn === color && !isGameOver;
    const bgColor = isActive ? 'bg-purple-900/30' : 'bg-gray-900';
    const lastMove = lastMoves[color];

    return (
      <div className={`p-3 rounded-lg text-center transition-colors ${bgColor}`}>
        <h4 className="font-bold text-lg flex items-center justify-center gap-2">
          {color === 'w' ? 'White' : 'Black'}
          {isActive && <span className="text-xs font-semibold text-purple-300 bg-purple-800 px-2 py-0.5 rounded-full">Active</span>}
        </h4>
        <div className="mt-2">
          <p className="text-sm text-gray-400">Last Move</p>
          <p className="text-lg font-semibold text-cyan-400 h-7">{formatTime(lastResponseTimes[color])}</p>
          <p className="text-lg font-mono text-white h-7">
            {lastMove ? `${lastMove.from} → ${lastMove.to}` : '-'}
          </p>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-400">Total Time</p>
          <p className="text-lg font-semibold text-cyan-400">{formatTime(totalResponseTimes[color])}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">AI vs AI Matchup</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="white-player" className="block text-sm font-medium text-gray-300 mb-1">White Player</label>
          <select
            id="white-player"
            value={whitePlayerModel.id}
            onChange={(e) => handleModelChange(e, 'white')}
            disabled={isAiThinking || isAutoPlaying}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
          >
            {renderOptions()}
          </select>
        </div>
        <div>
          <label htmlFor="black-player" className="block text-sm font-medium text-gray-300 mb-1">Black Player</label>
          <select
            id="black-player"
            value={blackPlayerModel.id}
            onChange={(e) => handleModelChange(e, 'black')}
            disabled={isAiThinking || isAutoPlaying}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
          >
            {renderOptions()}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Performance Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <PlayerStats color="w" />
          <PlayerStats color="b" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onMakeAiMove}
          disabled={isAiThinking || isGameOver || isAutoPlaying}
          className="w-full flex justify-center items-center px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold transition-all duration-200 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Make next AI move"
        >
          {isAiThinking && !isAutoPlaying ? (
            <>
              <LoadingSpinner />
              Thinking...
            </>
          ) : (
            'Make AI Move'
          )}
        </button>
        <button
          onClick={onToggleAutoPlay}
          disabled={isGameOver}
          className={`w-full flex justify-center items-center px-4 py-3 rounded-md font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed ${isAutoPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          aria-label={isAutoPlaying ? 'Stop auto play' : 'Start auto play'}
        >
          {isAutoPlaying ? (
            isAiThinking ? <LoadingSpinner /> : 'Stop Auto Play'
          ) : (
            'Auto Play'
          )}
        </button>
      </div>

      {aiError && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
          <h3 className="font-semibold text-red-300 mb-1">Error</h3>
          <p className="text-red-400 text-sm">{aiError}</p>
        </div>
      )}
    </div>
  );
};
