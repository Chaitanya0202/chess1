import { GameState, PieceType } from './components/types';

const createPiece = (color: string, type: string): PieceType => ({ color, type });

export const initialGameState: GameState = {
  board: [
    [createPiece('black', 'r'), createPiece('black', 'n'), createPiece('black', 'b'), createPiece('black', 'q'), createPiece('black', 'k'), createPiece('black', 'b'), createPiece('black', 'n'), createPiece('black', 'r')],
    [createPiece('black', 'p'), createPiece('black', 'p'), createPiece('black', 'p'), createPiece('black', 'p'), createPiece('black', 'p'), createPiece('black', 'p'), createPiece('black', 'p'), createPiece('black', 'p')],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [createPiece('white', 'p'), createPiece('white', 'p'), createPiece('white', 'p'), createPiece('white', 'p'), createPiece('white', 'p'), createPiece('white', 'p'), createPiece('white', 'p'), createPiece('white', 'p')],
    [createPiece('white', 'r'), createPiece('white', 'n'), createPiece('white', 'b'), createPiece('white', 'q'), createPiece('white', 'k'), createPiece('white', 'b'), createPiece('white', 'n'), createPiece('white', 'r')]
  ],
  turn: 'white',
  isCheck: false,
  isCheckmate: false,
  castlingRights: {
    white: { kingSide: true, queenSide: true },
    black: { kingSide: true, queenSide: true }
  }
}

export const isValidMove = (piece: PieceType, from: [number, number], to: [number, number], board: (PieceType | null)[][], castlingRights: any): boolean => {
  const [fromX, fromY] = from;
  const [toX, toY] = to;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const targetPiece = board[toY][toX];

  // Ensure the target square is not occupied by a piece of the same color
  if (targetPiece && targetPiece.color === piece.color) {
    return false;
  }

  switch (piece.type) {
    case 'p': // Pawn
      if (piece.color === 'white') {
        return (dx === 0 && dy === -1 && !targetPiece) || (dx === 0 && dy === -2 && fromY === 6 && !targetPiece && board[fromY - 1][fromX] === null) ||
               (Math.abs(dx) === 1 && dy === -1 && targetPiece && targetPiece.color === 'black');
      } else {
        return (dx === 0 && dy === 1 && !targetPiece) || (dx === 0 && dy === 2 && fromY === 1 && !targetPiece && board[fromY + 1][fromX] === null) ||
               (Math.abs(dx) === 1 && dy === 1 && targetPiece && targetPiece.color === 'white');
      }
    case 'r': // Rook
      if (dx !== 0 && dy !== 0) return false;
      for (let i = 1; i < Math.abs(dx || dy); i++) {
        if (board[fromY + i * Math.sign(dy)][fromX + i * Math.sign(dx)] !== null) return false;
      }
      return true;
    case 'n': // Knight
      return (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2);
    case 'b': // Bishop
      if (Math.abs(dx) !== Math.abs(dy)) return false;
      for (let i = 1; i < Math.abs(dx); i++) {
        if (board[fromY + i * Math.sign(dy)][fromX + i * Math.sign(dx)] !== null) return false;
      }
      return true;
    case 'q': // Queen
      if (dx === 0 || dy === 0) {
        for (let i = 1; i < Math.abs(dx || dy); i++) {
          if (board[fromY + i * Math.sign(dy)][fromX + i * Math.sign(dx)] !== null) return false;
        }
        return true;
      } else if (Math.abs(dx) === Math.abs(dy)) {
        for (let i = 1; i < Math.abs(dx); i++) {
          if (board[fromY + i * Math.sign(dy)][fromX + i * Math.sign(dx)] !== null) return false;
        }
        return true;
      }
      return false;
    case 'k': // King
      if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
        return true;
      }
      // Castling
      if (piece.color === 'white' && fromY === 7 && fromX === 4) {
        if (toY === 7 && toX === 6 && castlingRights.white.kingSide) {
          // King-side castling
          return board[7][5] === null && board[7][6] === null && !isKingInCheck(board, 'white') && !isKingInCheck(board, 'white', [5, 7]) && !isKingInCheck(board, 'white', [6, 7]);
        }
        if (toY === 7 && toX === 2 && castlingRights.white.queenSide) {
          // Queen-side castling
          return board[7][1] === null && board[7][2] === null && board[7][3] === null && !isKingInCheck(board, 'white') && !isKingInCheck(board, 'white', [3, 7]) && !isKingInCheck(board, 'white', [2, 7]);
        }
      }
      if (piece.color === 'black' && fromY === 0 && fromX === 4) {
        if (toY === 0 && toX === 6 && castlingRights.black.kingSide) {
          // King-side castling
          return board[0][5] === null && board[0][6] === null && !isKingInCheck(board, 'black') && !isKingInCheck(board, 'black', [5, 0]) && !isKingInCheck(board, 'black', [6, 0]);
        }
        if (toY === 0 && toX === 2 && castlingRights.black.queenSide) {
          // Queen-side castling
          return board[0][1] === null && board[0][2] === null && board[0][3] === null && !isKingInCheck(board, 'black') && !isKingInCheck(board, 'black', [3, 0]) && !isKingInCheck(board, 'black', [2, 0]);
        }
      }
      return false;
    default:
      return false;
  }
}

const isKingInCheck = (board: (PieceType | null)[][], kingColor: string, kingPositionOverride?: [number, number]): boolean => {
  let kingPosition: [number, number] | null = kingPositionOverride || null;

  // Find the king's position if not overridden
  if (!kingPosition) {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece && piece.type === 'k' && piece.color === kingColor) {
          kingPosition = [x, y];
          break;
        }
      }
      if (kingPosition) break;
    }
  }

  if (!kingPosition) return false;

  // Check if any opponent piece can move to the king's position
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color !== kingColor) {
        if (isValidMove(piece, [x, y], kingPosition, board, {})) {
          return true;
        }
      }
    }
  }

  return false;
}

const isMoveValid = (gameState: GameState, from: [number, number], to: [number, number]): boolean => {
  const newBoard = gameState.board.map(row => row.slice());
  const piece = newBoard[from[1]][from[0]];

  // Ensure the piece exists and the move is valid
  if (!piece || piece.color !== gameState.turn || !isValidMove(piece, from, to, newBoard, gameState.castlingRights)) {
    return false;
  }

  newBoard[from[1]][from[0]] = null;
  newBoard[to[1]][to[0]] = piece;

  // Check if the move puts the player's own king in check
  const isCheck = isKingInCheck(newBoard, gameState.turn);
  return !isCheck;
}

const isCheckmate = (gameState: GameState, kingColor: string): boolean => {
  const newBoard = gameState.board.map(row => row.slice());

  // Check if the king is in check
  if (!isKingInCheck(newBoard, kingColor)) {
    return false;
  }

  // Check if there are any valid moves left for the player
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = newBoard[y][x];
      if (piece && piece.color === kingColor) {
        for (let toY = 0; toY < 8; toY++) {
          for (let toX = 0; toX < 8; toX++) {
            if (isValidMove(piece, [x, y], [toX, toY], newBoard, gameState.castlingRights)) {
              const tempBoard = newBoard.map(row => row.slice());
              tempBoard[y][x] = null;
              tempBoard[toY][toX] = piece;
              if (!isKingInCheck(tempBoard, kingColor)) {
                return false;
              }
            }
          }
        }
      }
    }
  }

  return true;
}

export const handleMove = (gameState: GameState, from: [number, number], to: [number, number]): GameState => {
  if (!isMoveValid(gameState, from, to)) {
    return gameState;
  }

  const newBoard = gameState.board.map(row => row.slice());
  const piece = newBoard[from[1]][from[0]];

  newBoard[from[1]][from[0]] = null;
  newBoard[to[1]][to[0]] = piece;

  // Handle castling
  if (piece.type === 'k' && Math.abs(to[0] - from[0]) === 2) {
    if (to[0] === 6) {
      // King-side castling
      newBoard[to[1]][5] = newBoard[to[1]][7];
      newBoard[to[1]][7] = null;
    } else if (to[0] === 2) {
      // Queen-side castling
      newBoard[to[1]][3] = newBoard[to[1]][0];
      newBoard[to[1]][0] = null;
    }
  }

  // Update castling rights
  const castlingRights = { ...gameState.castlingRights };
  if (piece.type === 'k') {
    if (piece.color === 'white') {
      castlingRights.white.kingSide = false;
      castlingRights.white.queenSide = false;
    } else {
      castlingRights.black.kingSide = false;
      castlingRights.black.queenSide = false;
    }
  } else if (piece.type === 'r') {
    if (piece.color === 'white') {
      if (from[0] === 0 && from[1] === 7) castlingRights.white.queenSide = false;
      if (from[0] === 7 && from[1] === 7) castlingRights.white.kingSide = false;
    } else {
      if (from[0] === 0 && from[1] === 0) castlingRights.black.queenSide = false;
      if (from[0] === 7 && from[1] === 0) castlingRights.black.kingSide = false;
    }
  }

  // Check if the move puts the opponent's king in check
  const opponentColor = gameState.turn === 'white' ? 'black' : 'white';
  const isCheck = isKingInCheck(newBoard, opponentColor);
  const isCheckmateResult = isCheck && isCheckmate({ ...gameState, board: newBoard }, opponentColor);

  return {
    ...gameState,
    board: newBoard,
    turn: gameState.turn === 'white' ? 'black' : 'white',
    isCheck,
    isCheckmate: isCheckmateResult,
    castlingRights
  };
}

export const convertToCoords = (pos: string): [number, number] => {
  const x = pos.charCodeAt(0) - 'a'.charCodeAt(0);
  const y = 8 - parseInt(pos[1]);
  return [x, y];
}
