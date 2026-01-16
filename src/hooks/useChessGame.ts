
import { useState, useCallback, useMemo } from 'react';
import { Chess, Square, Move} from 'chess.js';
import type { GameStatus, ChessPiece, CapturedPiecesSet, PieceType } from '../types';

const INITIAL_PIECES: Record<PieceType, number> = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };

export const useChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState(game.board());
  const [selectedPiece, setSelectedPiece] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);
  const [forcedWin, setForcedWin] = useState<{ reason: string } | null>(null);

  const updateStatus = useCallback(() => {
    setBoard(game.board());
  }, [game]);

  const resetGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setBoard(newGame.board());
    setSelectedPiece(null);
    setPossibleMoves([]);
    setForcedWin(null);
  }, []);

  const forceWin = (_winner: 'w' | 'b', reason: string) => {
    // We don't have a way to set winner in chess.js, so we use a state to override status
    setForcedWin({ reason });
    // The isGameOver flag in App.tsx and useChessGame.ts will prevent further moves.
    // The board state is preserved by not clearing the game object.
  };

  const makeMove = useCallback((move: string): Move | null => {
    try {
      const moveResult = game.move(move);
      if (moveResult) {
        updateStatus();
      } else {
        console.error("Invalid or illegal move received:", move);
      }
      return moveResult;
    } catch (e) {
      console.error("Error applying move:", move, e);
      return null;
    }
  }, [game, updateStatus]);

  const status: GameStatus = useMemo(() => {
    let message = '';
    const isGameOver = game.isGameOver() || !!forcedWin;

    if (forcedWin) {
      message = forcedWin.reason;
    } else if (game.isCheckmate()) {
      message = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`;
    } else if (game.isDraw()) {
      message = 'Draw!';
    } else if (game.isStalemate()) {
      message = 'Stalemate!';
    } else if (game.isThreefoldRepetition()) {
      message = 'Draw by threefold repetition!';
    } else if (game.isInsufficientMaterial()) {
      message = 'Draw by insufficient material!';
    } else if (game.isCheck()) {
      message = 'Check!';
    }

    return {
      isCheck: game.isCheck(),
      isCheckmate: game.isCheckmate(),
      isDraw: game.isDraw(),
      isStalemate: game.isStalemate(),
      isThreefoldRepetition: game.isThreefoldRepetition(),
      isInsufficientMaterial: game.isInsufficientMaterial(),
      isGameOver,
      message,
    };
  }, [game, board, forcedWin]);

  const capturedPieces: CapturedPiecesSet = useMemo(() => {
    const currentPieces = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    };

    game.board().flat().forEach(piece => {
      if (piece) {
        currentPieces[piece.color][piece.type]++;
      }
    });

    const captured: CapturedPiecesSet = { w: [], b: [] };

    for (const color of ['w', 'b'] as const) {
      const opponentColor = color === 'w' ? 'b' : 'w';
      for (const type of Object.keys(INITIAL_PIECES) as PieceType[]) {
        const capturedCount = INITIAL_PIECES[type] - currentPieces[opponentColor][type];
        for (let i = 0; i < capturedCount; i++) {
          captured[color].push({ color: opponentColor, type } as ChessPiece);
        }
      }
    }
    return captured;
  }, [board]);

  const handleSquareClick = useCallback((square: Square) => {
    if (status.isGameOver) return;

    if (selectedPiece) {
      const move = possibleMoves.find(m => m.to === square);
      if (move) {
        game.move(move);
        updateStatus();
      }
      setSelectedPiece(null);
      setPossibleMoves([]);
    } else {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedPiece(square);
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves as Move[]);
      }
    }
  }, [game, selectedPiece, possibleMoves, status.isGameOver, updateStatus]);

  return {
    game,
    board,
    status,
    turn: game.turn(),
    history: game.history({ verbose: true }) as Move[],
    possibleMoves,
    selectedPiece,
    handleSquareClick,
    resetGame,
    makeMove,
    capturedPieces,
    forceWin,
  };
};
