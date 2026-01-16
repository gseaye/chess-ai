
import React from 'react';
import { Square, Piece } from 'chess.js';
import { PieceComponent } from '../assets/pieces';
import type { ChessPiece } from '../types';

interface ChessboardProps {
  board: (Piece | null)[][];
  onSquareClick: (square: Square) => void;
  possibleMoves: { to: Square }[];
  selectedPiece: Square | null;
  turn: 'w' | 'b';
  flashingSquares: { from: Square | null, to: Square | null };
}

export const Chessboard: React.FC<ChessboardProps> = ({ board, onSquareClick, possibleMoves, selectedPiece, turn, flashingSquares }) => {
  const renderSquare = (rowIdx: number, colIdx: number, piece: Piece | null) => {
    const squareName = String.fromCharCode(97 + colIdx) + (8 - rowIdx) as Square;
    const isLight = (rowIdx + colIdx) % 2 !== 0;
    const isSelected = selectedPiece === squareName;
    const isPossibleMove = possibleMoves.some(move => move.to === squareName);
    const isPlayerTurn = piece?.color === turn;
    const isFlashing = squareName === flashingSquares.from || squareName === flashingSquares.to;

    const bgClass = isLight ? 'bg-gray-400' : 'bg-gray-700';
    const selectionClass = isSelected ? 'ring-4 ring-yellow-400 z-10' : '';
    const hoverClass = 'hover:bg-yellow-400/30';
    const cursorClass = isPlayerTurn ? 'cursor-pointer' : 'cursor-default';
    const flashClass = isFlashing ? 'animate-flash' : '';

    return (
      <div
        key={squareName}
        onClick={() => onSquareClick(squareName)}
        className={`w-full h-full flex justify-center items-center relative ${bgClass} ${selectionClass} ${cursorClass} ${hoverClass} ${flashClass}`}
        aria-label={`Square ${squareName} ${piece ? `contains a ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : 'is empty'}`}
      >
        {piece && <PieceComponent piece={piece as ChessPiece} />}
        {isPossibleMove && (
          <div className="absolute w-1/3 h-1/3 bg-yellow-500/50 rounded-full" />
        )}
      </div>
    );
  };

  return (
    <div className="w-full aspect-square grid grid-cols-8 grid-rows-8 shadow-2xl rounded-lg overflow-hidden border-4 border-gray-800">
      {board.map((row, rowIdx) =>
        row.map((piece, colIdx) => renderSquare(rowIdx, colIdx, piece))
      )}
    </div>
  );
};
