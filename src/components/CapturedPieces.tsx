
import React from 'react';
import { PieceComponent } from '../assets/pieces';
import { CapturedPiecesSet, ChessPiece, PieceType } from '../types';

interface CapturedPiecesProps {
  capturedPieces: CapturedPiecesSet;
}

const pieceOrder: Record<PieceType, number> = { q: 1, r: 2, b: 3, n: 4, p: 5, k: 6 };

const sortPieces = (pieces: ChessPiece[]) => {
  return pieces.sort((a, b) => pieceOrder[a.type] - pieceOrder[b.type]);
};

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({ capturedPieces }) => {
  const sortedWhiteCaptures = sortPieces(capturedPieces.w);
  const sortedBlackCaptures = sortPieces(capturedPieces.b);

  const renderCapturedRow = (pieces: ChessPiece[], color: 'White' | 'Black') => (
    <div className="flex items-center h-8 bg-gray-800/30 px-2 rounded">
      <div className="w-16 text-sm font-bold text-gray-400">{color}</div>
      <div className="flex items-center gap-1">
        {pieces.map((piece, index) => (
          <div key={`${piece.color}-${piece.type}-${index}`} className="w-5 h-5">
            <PieceComponent piece={piece} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-2 space-y-1">
      {renderCapturedRow(sortedWhiteCaptures, 'White')}
      {renderCapturedRow(sortedBlackCaptures, 'Black')}
    </div>
  );
};
