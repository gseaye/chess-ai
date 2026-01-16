
import { useState, useCallback, useEffect } from 'react';
import { Chessboard } from './components/Chessboard';
import { GameInfo } from './components/GameInfo';
import { AiMatchup } from './components/AiMatchup';
import { SecretsPanel } from './components/SecretsPanel';
import { CapturedPieces } from './components/CapturedPieces';
import { Fireworks } from './components/Fireworks';
import { useChessGame } from './hooks/useChessGame';
import { getAiMove } from './services/aiService';
import { Model, AppSettings } from './types';
import { AVAILABLE_MODELS } from './constants';
import { SettingsIcon } from './assets/icons';
import { Move, Square } from 'chess.js';
import { useMoveLogger, ExportPanel } from './components/MoveLogger';


const initialAppSettings: AppSettings = {
  gemini: '',
  openai: '',
  anthropic: '',
  deepseek: '',
  mistral: '',
  ibm: '',
  ibmProjectId: '',
  ibmRegion: '',
  gameTimeLength: 180,
};

export default function App() {
  const {
    game,
    board,
    status,
    turn,
    history,
    resetGame,
    makeMove,
    capturedPieces,
    forceWin,
  } = useChessGame();

  const {
  currentGameId: _currentGameId,
  moveLogs,
  gameMetadata: _gameMetadata,
  startNewGame,
  logMove,
  endGame,
  exportToJSON,
  exportToCSV,
} = useMoveLogger();


  const [whitePlayerModel, setWhitePlayerModel] = useState<Model>(AVAILABLE_MODELS[0]);
  const [blackPlayerModel, setBlackPlayerModel] = useState<Model>(AVAILABLE_MODELS[0]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isSecretsPanelOpen, setIsSecretsPanelOpen] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>(initialAppSettings);
  const [lastResponseTimes, setLastResponseTimes] = useState({ w: 0, b: 0 });
  const [totalResponseTimes, setTotalResponseTimes] = useState({ w: 0, b: 0 });
  const [lastMoves, setLastMoves] = useState<{ w: Move | null; b: Move | null }>({ w: null, b: null });
  const [flashingSquares, setFlashingSquares] = useState<{ from: Square | null, to: Square | null }>({ from: null, to: null });
  const [fireworksKey, setFireworksKey] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [invalidMoveCounter, setInvalidMoveCounter] = useState({ w: 0, b: 0 });



useEffect(() => {
  const storedSettings = localStorage.getItem('appSettings');
  let settings: AppSettings;
  if (storedSettings) {
    const parsed = JSON.parse(storedSettings);
    settings = { ...initialAppSettings, ...parsed };
  } else {
    // Vite exposes env variables via import.meta.env
    settings = {
      ...initialAppSettings,
      gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
      openai: import.meta.env.VITE_OPENAI_API_KEY || '',
      anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
      deepseek: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
      mistral: import.meta.env.VITE_MISTRAL_API_KEY || '',
      ibm: import.meta.env.VITE_IBM_API_KEY || '',
      ibmProjectId: import.meta.env.VITE_IBM_PROJECT_ID || '',
      ibmRegion: import.meta.env.VITE_IBM_REGION || '',
    };
  }
  setAppSettings(settings);
  
  // Initialize game logging after settings are loaded
  startNewGame(
    whitePlayerModel.name,
    whitePlayerModel.provider,
    blackPlayerModel.name,
    blackPlayerModel.provider,
    settings.gameTimeLength
  );
}, []);


  const handleSaveSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    setIsSecretsPanelOpen(false);
  };

  const handleReset = () => {
    resetGame();
    setAiError(null);
    setIsAiThinking(false);
    setLastResponseTimes({ w: 0, b: 0 });
    setTotalResponseTimes({ w: 0, b: 0 });
    setLastMoves({ w: null, b: null });
    setFlashingSquares({ from: null, to: null });
    setFireworksKey(null);
    setIsAutoPlaying(false);
    setInvalidMoveCounter({ w: 0, b: 0 });
    
    // Add these lines:
    startNewGame(
      whitePlayerModel.name,
      whitePlayerModel.provider,
      blackPlayerModel.name,
      blackPlayerModel.provider,
      appSettings.gameTimeLength
    );
  };

  const handleAiMove = useCallback(async () => {
    if (status.isGameOver || isAiThinking) {
      setIsAutoPlaying(false);
      return;
    }

    setIsAiThinking(true);
    setAiError(null);

    const currentTurn = game.turn();
    const modelToUse = currentTurn === 'w' ? whitePlayerModel : blackPlayerModel;

    try {
      const startTime = performance.now();

      const legalMoves = game.moves(); // ex: ["Nf3", "exd5", "c3", ...]
      const moveSan = await getAiMove(game.fen(), currentTurn, modelToUse, appSettings, legalMoves);
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      const newTotalTime = totalResponseTimes[currentTurn] + duration;

      if (appSettings.gameTimeLength > 0 && newTotalTime > appSettings.gameTimeLength * 1000) {
        const winner = currentTurn === 'w' ? 'b' : 'w';
        forceWin(winner, `${currentTurn === 'w' ? 'White' : 'Black'} lost on time.`);
        endGame(winner === 'w' ? 'White wins' : 'Black wins', `${currentTurn === 'w' ? 'White' : 'Black'} lost on time.`);
        setFireworksKey(Date.now());
        setIsAutoPlaying(false);
        setIsAiThinking(false);
        return;
      }
      
      const fenBefore = game.fen();
      const moveResult = makeMove(moveSan);
      const fenAfter = game.fen();

      // Log the move
      logMove({
        player: currentTurn,
        fenBefore,
        fenAfter,
        proposedMove: moveSan,
        executedMove: moveResult,
        timeToDecide: duration,
        llmModel: modelToUse.name,
        llmProvider: modelToUse.provider,
        isCheck: game.isCheck(),
        isCheckmate: game.isCheckmate(),
        isStalemate: game.isStalemate(),
        isDraw: game.isDraw(),
      });


      if (moveResult) {
        setLastResponseTimes(prev => ({ ...prev, [currentTurn]: duration }));
        setTotalResponseTimes(prev => ({ ...prev, [currentTurn]: newTotalTime }));
        setLastMoves(prev => ({ ...prev, [currentTurn]: moveResult }));
        setInvalidMoveCounter(prev => ({ ...prev, [currentTurn]: 0 })); // Reset counter on valid move
        
        setFlashingSquares({ from: moveResult.from, to: moveResult.to });
        setTimeout(() => setFlashingSquares({ from: null, to: null }), 1500);

        if (game.isGameOver()) {
          let result = 'Draw';
          let reason = 'Unknown';
          
          if (game.isCheckmate()) {
            result = currentTurn === 'w' ? 'Black wins' : 'White wins';
            reason = 'Checkmate';
            setFireworksKey(Date.now());
          } else if (game.isStalemate()) {
            reason = 'Stalemate';
          } else if (game.isThreefoldRepetition()) {
            reason = 'Threefold repetition';
          } else if (game.isInsufficientMaterial()) {
            reason = 'Insufficient material';
          } else if (game.isDraw()) {
            reason = 'Draw by 50-move rule';
          }
          
          endGame(result, reason);
          setIsAutoPlaying(false);
        }

      } else {
        // Handle invalid move
        setLastResponseTimes(prev => ({ ...prev, [currentTurn]: duration }));
        setTotalResponseTimes(prev => ({ ...prev, [currentTurn]: newTotalTime }));
        
        const newInvalidCount = invalidMoveCounter[currentTurn] + 1;
        setInvalidMoveCounter(prev => ({ ...prev, [currentTurn]: newInvalidCount }));

        if (newInvalidCount >= 2) {
          const winner = currentTurn === 'w' ? 'b' : 'w';
          const loserName = currentTurn === 'w' ? 'White' : 'Black';
          const winnerName = winner === 'w' ? 'White' : 'Black';
          const message = `${loserName} received 2 yellows and is sent off. ${winnerName} is the winner.`;
          forceWin(winner, message);
          endGame(winner === 'w' ? 'White wins' : 'Black wins', message);
          setFireworksKey(Date.now());
        } else {
          setAiError(`The AI (${modelToUse.name}) suggested an invalid move: "${moveSan}". This is strike ${newInvalidCount}.`);
        }
        setIsAutoPlaying(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        setAiError(error.message);
      } else {
        setAiError('An unknown error occurred while getting the AI move.');
      }
      setIsAutoPlaying(false);
    } finally {
      setIsAiThinking(false);
    }
  }, [game, status.isGameOver, isAiThinking, whitePlayerModel, blackPlayerModel, makeMove, appSettings, totalResponseTimes, forceWin, invalidMoveCounter]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  useEffect(() => {
    if (isAutoPlaying && !isAiThinking && !status.isGameOver) {
      handleAiMove();
    }
  }, [isAutoPlaying, isAiThinking, status.isGameOver, history]); // history is a proxy for turn change




  return (
    <>
      <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-6xl mx-auto">
          <header className="text-center mb-6 relative">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 pb-2">
              AI Champions League
            </h1>
            <p className="text-gray-400 mt-2">Watch two Grandmaster AIs battle it out.</p>
            <button 
              onClick={() => setIsSecretsPanelOpen(true)}
              className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Configure API Keys"
            >
              <SettingsIcon className="w-6 h-6" />
            </button>
          </header>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 justify-center">
            <div className="flex-shrink-0 w-full max-w-lg mx-auto lg:mx-0">
              <Chessboard
                board={board}
                onSquareClick={() => {}} // Disable manual moves for AI vs AI
                possibleMoves={[]}
                selectedPiece={null}
                turn={turn}
                flashingSquares={flashingSquares}
              />
              <CapturedPieces capturedPieces={capturedPieces} />
            </div>

            <div className="flex-grow w-full max-w-md mx-auto lg:mx-0 lg:max-w-sm flex flex-col gap-6">
              <GameInfo
                status={status}
                turn={turn}
                history={history}
                onReset={handleReset}
              />
              <AiMatchup
                whitePlayerModel={whitePlayerModel}
                blackPlayerModel={blackPlayerModel}
                onWhitePlayerModelChange={setWhitePlayerModel}
                onBlackPlayerModelChange={setBlackPlayerModel}
                onMakeAiMove={handleAiMove}
                isAiThinking={isAiThinking}
                isGameOver={status.isGameOver}
                aiError={aiError}
                lastResponseTimes={lastResponseTimes}
                totalResponseTimes={totalResponseTimes}
                lastMoves={lastMoves}
                turn={turn}
                isAutoPlaying={isAutoPlaying}
                onToggleAutoPlay={toggleAutoPlay}
              />
              {/* Add this: */}
              <ExportPanel 
                onExportJSON={exportToJSON}
                onExportCSV={exportToCSV}
                moveCount={moveLogs.length}
                gameInProgress={!status.isGameOver}
              />
            </div>
          </div>
        </div>
      </main>
      {fireworksKey && <Fireworks key={fireworksKey} />}
      <SecretsPanel 
        isOpen={isSecretsPanelOpen}
        onClose={() => setIsSecretsPanelOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={appSettings}
      />
    </>
  );
}
