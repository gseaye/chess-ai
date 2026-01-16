import { useState, useCallback } from 'react';
import { Move } from 'chess.js';

// Types for move logging
interface MoveLog {
  gameId: string;
  moveNumber: number;
  timestamp: string;
  player: 'white' | 'black';
  playerColor: 'w' | 'b';
  fenBefore: string;
  fenAfter: string;
  proposedMove: string;
  executedMove: string | null;
  moveValid: boolean;
  timeToDecide: number; // milliseconds
  llmModel: string;
  llmProvider: string;
  capturedPiece: string | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  castling: boolean;
  enPassant: boolean;
  promotion: string | null;
}

interface GameMetadata {
  gameId: string;
  startTime: string;
  endTime: string | null;
  whiteModel: string;
  whiteProvider: string;
  blackModel: string;
  blackProvider: string;
  result: string | null;
  resultReason: string | null;
  totalMoves: number;
  timeControl: number;
  whiteTimeUsed: number;
  blackTimeUsed: number;
  whiteInvalidMoves: number;
  blackInvalidMoves: number;
}

// Move Logger Hook
export function useMoveLogger() {
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [moveLogs, setMoveLogs] = useState<MoveLog[]>([]);
  const [gameMetadata, setGameMetadata] = useState<GameMetadata | null>(null);

  const startNewGame = useCallback((
    whiteModel: string,
    whiteProvider: string,
    blackModel: string,
    blackProvider: string,
    timeControl: number
  ) => {
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = new Date().toISOString();

    setCurrentGameId(gameId);
    setMoveLogs([]);
    setGameMetadata({
      gameId,
      startTime,
      endTime: null,
      whiteModel,
      whiteProvider,
      blackModel,
      blackProvider,
      result: null,
      resultReason: null,
      totalMoves: 0,
      timeControl,
      whiteTimeUsed: 0,
      blackTimeUsed: 0,
      whiteInvalidMoves: 0,
      blackInvalidMoves: 0,
    });

    return gameId;
  }, []);

  const logMove = useCallback((moveData: {
    player: 'w' | 'b';
    fenBefore: string;
    fenAfter: string;
    proposedMove: string;
    executedMove: Move | null;
    timeToDecide: number;
    llmModel: string;
    llmProvider: string;
    isCheck: boolean;
    isCheckmate: boolean;
    isStalemate: boolean;
    isDraw: boolean;
  }) => {
    if (!currentGameId || !gameMetadata) return;

    const moveLog: MoveLog = {
      gameId: currentGameId,
      moveNumber: moveLogs.length + 1,
      timestamp: new Date().toISOString(),
      player: moveData.player === 'w' ? 'white' : 'black',
      playerColor: moveData.player,
      fenBefore: moveData.fenBefore,
      fenAfter: moveData.fenAfter,
      proposedMove: moveData.proposedMove,
      executedMove: moveData.executedMove?.san || null,
      moveValid: moveData.executedMove !== null,
      timeToDecide: moveData.timeToDecide,
      llmModel: moveData.llmModel,
      llmProvider: moveData.llmProvider,
      capturedPiece: moveData.executedMove?.captured || null,
      isCheck: moveData.isCheck,
      isCheckmate: moveData.isCheckmate,
      isStalemate: moveData.isStalemate,
      isDraw: moveData.isDraw,
      castling: moveData.executedMove?.flags?.includes('k') || moveData.executedMove?.flags?.includes('q') || false,
      enPassant: moveData.executedMove?.flags?.includes('e') || false,
      promotion: moveData.executedMove?.promotion || null,
    };

    setMoveLogs(prev => [...prev, moveLog]);

    // Update metadata
    setGameMetadata(prev => {
      if (!prev) return null;
      return {
        ...prev,
        totalMoves: prev.totalMoves + 1,
        whiteTimeUsed: moveData.player === 'w' ? prev.whiteTimeUsed + moveData.timeToDecide : prev.whiteTimeUsed,
        blackTimeUsed: moveData.player === 'b' ? prev.blackTimeUsed + moveData.timeToDecide : prev.blackTimeUsed,
        whiteInvalidMoves: moveData.player === 'w' && !moveData.executedMove ? prev.whiteInvalidMoves + 1 : prev.whiteInvalidMoves,
        blackInvalidMoves: moveData.player === 'b' && !moveData.executedMove ? prev.blackInvalidMoves + 1 : prev.blackInvalidMoves,
      };
    });
  }, [currentGameId, gameMetadata, moveLogs.length]);

  const endGame = useCallback((result: string, reason: string) => {
    if (!gameMetadata) return;

    setGameMetadata(prev => {
      if (!prev) return null;
      return {
        ...prev,
        endTime: new Date().toISOString(),
        result,
        resultReason: reason,
      };
    });
  }, [gameMetadata]);

  const exportToJSON = useCallback(() => {
    if (!gameMetadata) return;

    const data = {
      metadata: gameMetadata,
      moves: moveLogs,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chess_game_${gameMetadata.gameId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [gameMetadata, moveLogs]);

  const exportToCSV = useCallback(() => {
    if (moveLogs.length === 0) return;

    const headers = [
      'gameId', 'moveNumber', 'timestamp', 'player', 'playerColor',
      'fenBefore', 'fenAfter', 'proposedMove', 'executedMove', 'moveValid',
      'timeToDecide', 'llmModel', 'llmProvider', 'capturedPiece',
      'isCheck', 'isCheckmate', 'isStalemate', 'isDraw',
      'castling', 'enPassant', 'promotion'
    ];

    const csvRows = [
      headers.join(','),
      ...moveLogs.map(log => [
        log.gameId,
        log.moveNumber,
        log.timestamp,
        log.player,
        log.playerColor,
        `"${log.fenBefore}"`,
        `"${log.fenAfter}"`,
        `"${log.proposedMove}"`,
        log.executedMove ? `"${log.executedMove}"` : '',
        log.moveValid,
        log.timeToDecide,
        `"${log.llmModel}"`,
        `"${log.llmProvider}"`,
        log.capturedPiece || '',
        log.isCheck,
        log.isCheckmate,
        log.isStalemate,
        log.isDraw,
        log.castling,
        log.enPassant,
        log.promotion || '',
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chess_moves_${currentGameId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [moveLogs, currentGameId]);

  return {
    currentGameId,
    moveLogs,
    gameMetadata,
    startNewGame,
    logMove,
    endGame,
    exportToJSON,
    exportToCSV,
  };
}

// Export Button Component
export function ExportPanel({ 
  onExportJSON, 
  onExportCSV, 
  moveCount,
  gameInProgress 
}: { 
  onExportJSON: () => void; 
  onExportCSV: () => void;
  moveCount: number;
  gameInProgress: boolean;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-gray-300">Export Game Data</h3>
      
      <div className="mb-3 text-sm text-gray-400">
        <div>Moves logged: <span className="text-white font-semibold">{moveCount}</span></div>
        <div>Status: <span className={gameInProgress ? "text-green-400" : "text-gray-500"}>
          {gameInProgress ? "Recording" : "Ready"}
        </span></div>
      </div>

      <div className="space-y-2">
        <button
          onClick={onExportJSON}
          disabled={moveCount === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-2 px-4 rounded transition-colors text-sm font-medium"
        >
          📥 Export as JSON
        </button>
        <button
          onClick={onExportCSV}
          disabled={moveCount === 0}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-2 px-4 rounded transition-colors text-sm font-medium"
        >
          📊 Export as CSV
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>Export includes complete move history with FEN positions, timing data, and model information.</p>
      </div>
    </div>
  );
}