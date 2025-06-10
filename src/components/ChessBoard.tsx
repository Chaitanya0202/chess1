import React, { useState } from 'react';
// import moveSound from '../../src/sound/sound-move.mp3';
// import captureSound from '../assets/sound-capture.mp3';
import { isValidMove } from '../gameLogic';
import Piece from './Piece';
import { GameState } from './types';

interface ChessBoardProps {
  gameState: GameState;
  onMove: (from: string, to: string) => void;
}

// const moveAudio = new Audio(moveSound);
const captureAudio = new Audio('');

const ChessBoard: React.FC<ChessBoardProps> = ({ gameState, onMove }) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const handleSquareClick = (i: number) => {
    const x = i % 8;
    const y = Math.floor(i / 8);
    const square = `${String.fromCharCode(97 + x)}${8 - y}`;

    if (selectedSquare) {
      const fromCoords = convertToCoords(selectedSquare);
      const toCoords = convertToCoords(square);
      const piece = gameState.board[toCoords[1]][toCoords[0]];

      if (piece) {
        captureAudio.play();
      } else {
        // moveAudio.play();
      }

      onMove(selectedSquare, square);
      setSelectedSquare(null);
    } else {
      const fromCoords = convertToCoords(square);
      const piece = gameState.board[fromCoords[1]][fromCoords[0]];
      if (piece && piece.color === gameState.turn) {
        setSelectedSquare(square);
      }
    }
  };

  const getValidMoves = (from: string): string[] => {
    const fromCoords = convertToCoords(from);
    const piece = gameState.board[fromCoords[1]][fromCoords[0]];
    if (!piece) return [];

    const validMoves: string[] = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const toCoords: [number, number] = [x, y];
        if (isValidMove(piece, fromCoords, toCoords, gameState.board, gameState.castlingRights)) {
          validMoves.push(`${String.fromCharCode(97 + x)}${8 - y}`);
        }
      }
    }
    return validMoves;
  };

  const renderSquare = (i: number) => {
    const x = i % 8;
    const y = Math.floor(i / 8);
    const piece = gameState.board[y][x];
    const square = `${String.fromCharCode(97 + x)}${8 - y}`;
    const isSelected = selectedSquare === square;
    const validMoves = selectedSquare ? getValidMoves(selectedSquare) : [];
    const isPossibleMove = validMoves.includes(square);

    // Check if the king is in check
    const isKingInCheck = piece && piece.type === 'k' && gameState.isCheck && piece.color === gameState.turn;

    return (
      <div
        key={i}
        className={`square ${((x + y) % 2 === 0) ? 'white' : 'black'} ${isSelected ? 'selected' : ''} ${isPossibleMove ? 'possible-move' : ''} ${isKingInCheck ? 'king-in-check' : ''}`}
        onClick={() => handleSquareClick(i)}
      >
        {piece && <Piece piece={piece} />}
      </div>
    );
  };

  return (
    <div className="chessboard">
      {Array(64).fill(null).map((_, i) => renderSquare(i))}
    </div>
  );
};

const convertToCoords = (pos: string): [number, number] => {
  const x = pos.charCodeAt(0) - 'a'.charCodeAt(0);
  const y = 8 - parseInt(pos[1]);
  return [x, y];
};

export default ChessBoard;