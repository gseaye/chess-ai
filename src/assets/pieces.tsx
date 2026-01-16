
import React from 'react';
import type { ChessPiece } from '../types';

const pieceMap: Record<ChessPiece['color'], Record<ChessPiece['type'], React.FC<React.SVGProps<SVGSVGElement>>>> = {
  b: {
    p: (props) => (
      <svg {...props} viewBox="0 0 45 45">
        <g fill="#000" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />
        </g>
      </svg>
    ),
    n: (props) => (
      <svg {...props} viewBox="0 0 45 45">
        <g fill="#000" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c-2 0-9-11.5-8-21 1-10 10-10 10-10zM24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003-1.66-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-1.994 2.96-2.5 4-1 1 2 1 3 1 3" />
        </g>
      </svg>
    ),
    b: (props) => (
      <svg {...props} viewBox="0 0 45 45">
        <g fill="#000" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 2.97 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.43-13.5-2-3.39 2.43-10.11 2.97-13.5 2 0 0-1.65.54-3 2 .68.97 1.65.99 3 .5z" />
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11-4-11 4-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
        </g>
      </svg>
    ),
    r: (props) => (
      <svg {...props} viewBox="0 0 45 45">
        <g fill="#000" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 39h27v-3H9v3zM12 36h21v-4H12v4zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
          <path d="M34 14l-3 3H14l-3-3" />
          <path d="M31 17v12.5H14V17" />
          <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
          <path d="M14 17h17" />
        </g>
      </svg>
    ),
    q: (props) => (
      <svg {...props} viewBox="0 0 45 45">
        <g fill="#000" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25L7 14l2 12z" />
          <path d="M9 26c0 2 1.5 4 4 4h15c2.5 0 4-2 4-4" />
          <path d="M11 30c0 2 2 4 4 4h11c2 0 4-2 4-4" />
          <path d="M12 34.5c0 1.5 2.5 2.5 5 2.5h11c2.5 0 5-1 5-2.5" />
          <path d="M12 34.5h21" />
        </g>
      </svg>
    ),
    k: (props) => (
      <svg {...props} viewBox="0 0 45 45">
        <g fill="#000" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 11.63V6M20 8h5" />
          <path d="M22.5 25c-6.42 0-12.5 4.5-13.5 14h27c-1-9.5-7.08-14-13.5-14z" />
          <path d="M11.5 30c3.5-1 6.5-1 11-1s7.5 0 11 1" />
          <path d="M12 35.5c4.5-1 7.5-1 10.5-1s6 0 10.5 1" />
          <path d="M22.5 11.63c6.42 0 12.5 4.5 13.5 14-1 1.5-1.5 2.5-1.5 2.5-3-1.5-6-2-9-2-3 0-6 .5-9 2 0 0-.5-1-1.5-2.5 1-9.5 7.08-14 13.5-14z" />
        </g>
      </svg>
    ),
  },
  w: {
    p: (props) => (
      <svg {...props} viewBox="0 0 45 45">
        <g fill="#FFF" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />
        </g>
      </svg>
    ),
    n: (props) => (
      <svg {...props} viewBox="0 0 45 45">
        <g fill="#FFF" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c-2 0-9-11.5-8-21 1-10 10-10 10-10zM24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003-1.66-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-1.994 2.96-2.5 4-1 1 2 1 3 1 3" />
        </g>
      </svg>
    ),
    b: (props) => (
      <svg {...props} viewBox="0 0 45 45">
        <g fill="#FFF" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 2.97 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.43-13.5-2-3.39 2.43-10.11 2.97-13.5 2 0 0-1.65.54-3 2 .68.97 1.65.99 3 .5z" />
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11-4-11 4-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
        </g>
      </svg>
    ),
    r: (props) => (
      <svg {...props} viewBox="0 0 45 45">
        <g fill="#FFF" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 39h27v-3H9v3zM12 36h21v-4H12v4zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
          <path d="M34 14l-3 3H14l-3-3" />
          <path d="M31 17v12.5H14V17" />
          <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
          <path d="M14 17h17" />
        </g>
      </svg>
    ),
    q: (props) => (
      <svg {...props} viewBox="0 0 45 45">
        <g fill="#FFF" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25L7 14l2 12z" />
          <path d="M9 26c0 2 1.5 4 4 4h15c2.5 0 4-2 4-4" />
          <path d="M11 30c0 2 2 4 4 4h11c2 0 4-2 4-4" />
          <path d="M12 34.5c0 1.5 2.5 2.5 5 2.5h11c2.5 0 5-1 5-2.5" />
          <path d="M12 34.5h21" />
        </g>
      </svg>
    ),
    k: (props) => (
      <svg {...props} viewBox="0 0 45 45">
        <g fill="#FFF" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 11.63V6M20 8h5" />
          <path d="M22.5 25c-6.42 0-12.5 4.5-13.5 14h27c-1-9.5-7.08-14-13.5-14z" />
          <path d="M11.5 30c3.5-1 6.5-1 11-1s7.5 0 11 1" />
          <path d="M12 35.5c4.5-1 7.5-1 10.5-1s6 0 10.5 1" />
          <path d="M22.5 11.63c6.42 0 12.5 4.5 13.5 14-1 1.5-1.5 2.5-1.5 2.5-3-1.5-6-2-9-2-3 0-6 .5-9 2 0 0-.5-1-1.5-2.5 1-9.5 7.08-14 13.5-14z" />
        </g>
      </svg>
    ),
  },
};

export const PieceComponent: React.FC<{ piece: ChessPiece }> = ({ piece }) => {
  const PieceSvg = pieceMap[piece.color][piece.type];
  return <PieceSvg className="w-full h-full" />;
};
