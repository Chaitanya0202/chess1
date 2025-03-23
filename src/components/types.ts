export interface PieceType {
  color: string;
  type: string;
}

export interface GameState {
  board: (PieceType | null)[][];
  turn: string;
  isCheck: boolean;
  isCheckmate: boolean;
  castlingRights: {
    white: { kingSide: boolean; queenSide: boolean };
    black: { kingSide: boolean; queenSide: boolean };
  };
}
