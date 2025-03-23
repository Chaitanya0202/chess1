import React from 'react';
import { PieceType } from './types';

interface PieceProps {
  piece: PieceType;
}

const Piece: React.FC<PieceProps> = ({ piece }) => {
  const pieceSymbols: { [key: string]: string } = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♙',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
  };

  const symbol = piece.color === 'white' && piece.type === 'p' ? pieceSymbols['P'] : pieceSymbols[piece.type];

  return (
    <div className={`piece ${piece.color}`}>
      {symbol}
    </div>
  );
};

export default Piece;
