import { useState } from 'react';
import './App.css';
import ChessBoard from './components/ChessBoard';
import { GameState } from './components/types'; // Adjust the import path as necessary
import { convertToCoords, handleMove, initialGameState } from './gameLogic';

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [history, setHistory] = useState<GameState[]>([initialGameState]);

  const onMove = (from: string, to: string) => {
    const fromCoords: [number, number] = convertToCoords(from);
    const toCoords: [number, number] = convertToCoords(to);
    const updatedGameState = handleMove(gameState, fromCoords, toCoords);
    setGameState(updatedGameState);
    setHistory([...history, updatedGameState]);
  };

  const onBackMove = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, history.length - 1);
      setGameState(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {gameState.isCheckmate && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center p-4">
          Checkmate! {gameState.turn === 'white' ? 'Black' : 'White'} wins!
        </div>
      )}
      <ChessBoard gameState={gameState} onMove={onMove} />
      {/* <button onClick={onBackMove} className="absolute bottom-4 left-4 bg-blue-500 text-white p-2 rounded">
        Back Move
      </button> */}
      <audio preload="auto" src="/play?t=e&amp;p=files/audio/ii/479434-Moving_King_01.mp3" className='bg-red-600 w-full'>dfsdgsdhsghs</audio>
    </div>
    
  );
}

export default App;
