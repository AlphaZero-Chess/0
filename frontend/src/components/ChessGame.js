import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { ArrowLeft, RotateCcw, Flag, Volume2, VolumeX, Zap } from 'lucide-react';

const ChessGame = ({ enemy, playerColor, onGameEnd, onBack }) => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState('start');
  const [isThinking, setIsThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastMove, setLastMove] = useState(null);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
  const stockfishRef = useRef(null);
  const isEngineReady = useRef(false);
  const pendingMove = useRef(false);

  // Get engine settings based on enemy type
  const getEngineSettings = useCallback(() => {
    switch (enemy?.id) {
      case 'elegant':
        // AlphaZero style: positional, strategic
        return {
          depth: 16,
          skillLevel: 20,
          contempt: 24,
          aggressiveness: 50,
          style: 'positional'
        };
      case 'nonelegant':
        // Aggressive, tactical beast
        return {
          depth: 18,
          skillLevel: 20,
          contempt: 100,
          aggressiveness: 200,
          style: 'aggressive'
        };
      case 'minia0':
        // Balanced, moderate
        return {
          depth: 12,
          skillLevel: 15,
          contempt: 0,
          aggressiveness: 100,
          style: 'balanced'
        };
      default:
        return {
          depth: 14,
          skillLevel: 18,
          contempt: 24,
          aggressiveness: 100,
          style: 'balanced'
        };
    }
  }, [enemy]);

  // Initialize Stockfish
  useEffect(() => {
    const initEngine = async () => {
      try {
        stockfishRef.current = new Worker('/stockfish.js');
        
        stockfishRef.current.onmessage = (event) => {
          const message = event.data;
          
          if (message === 'uciok') {
            const settings = getEngineSettings();
            stockfishRef.current.postMessage(`setoption name Skill Level value ${settings.skillLevel}`);
            stockfishRef.current.postMessage(`setoption name Contempt value ${settings.contempt}`);
            stockfishRef.current.postMessage('isready');
          }
          
          if (message === 'readyok') {
            isEngineReady.current = true;
            
            // If black plays first (player is white), or player is black and engine needs to move
            if (playerColor === 'white') {
              // Engine is black, player goes first - do nothing
            } else {
              // Engine is white, needs to make first move
              setTimeout(() => makeEngineMove(new Chess()), 500);
            }
          }
          
          if (message.startsWith('bestmove')) {
            const move = message.split(' ')[1];
            if (move && move !== '(none)' && pendingMove.current) {
              pendingMove.current = false;
              applyEngineMove(move);
            }
            setIsThinking(false);
          }
        };
        
        stockfishRef.current.postMessage('uci');
      } catch (error) {
        console.error('Failed to initialize Stockfish:', error);
      }
    };

    initEngine();

    return () => {
      if (stockfishRef.current) {
        stockfishRef.current.terminate();
      }
    };
  }, [playerColor, getEngineSettings]);

  // Apply engine's move to the game
  const applyEngineMove = useCallback((moveStr) => {
    setGame(prevGame => {
      const gameCopy = new Chess(prevGame.fen());
      try {
        const from = moveStr.substring(0, 2);
        const to = moveStr.substring(2, 4);
        const promotion = moveStr.length > 4 ? moveStr[4] : undefined;
        
        const moveResult = gameCopy.move({
          from,
          to,
          promotion: promotion || 'q'
        });
        
        if (moveResult) {
          setPosition(gameCopy.fen());
          setMoveHistory(prev => [...prev, moveResult.san]);
          setLastMove({ from, to });
          
          // Track captured pieces
          if (moveResult.captured) {
            const capturedColor = moveResult.color === 'w' ? 'black' : 'white';
            setCapturedPieces(prev => ({
              ...prev,
              [capturedColor]: [...prev[capturedColor], moveResult.captured]
            }));
          }
          
          // Check game state
          if (gameCopy.isGameOver()) {
            handleGameOver(gameCopy);
          }
        }
        return gameCopy;
      } catch (e) {
        console.error('Invalid engine move:', moveStr, e);
        return prevGame;
      }
    });
  }, []);

  // Make the engine move
  const makeEngineMove = useCallback((currentGame) => {
    if (!stockfishRef.current || !isEngineReady.current) return;
    if (currentGame.isGameOver()) return;
    
    const settings = getEngineSettings();
    setIsThinking(true);
    pendingMove.current = true;
    
    stockfishRef.current.postMessage(`position fen ${currentGame.fen()}`);
    stockfishRef.current.postMessage(`go depth ${settings.depth}`);
  }, [getEngineSettings]);

  // Handle game over
  const handleGameOver = (gameInstance) => {
    let result;
    if (gameInstance.isCheckmate()) {
      const loser = gameInstance.turn();
      const playerWon = (playerColor === 'white' && loser === 'b') || 
                        (playerColor === 'black' && loser === 'w');
      result = playerWon ? 'player' : 'enemy';
    } else if (gameInstance.isDraw()) {
      result = 'draw';
    } else if (gameInstance.isStalemate()) {
      result = 'draw';
    }
    
    setGameStatus('ended');
    setTimeout(() => onGameEnd(result), 1500);
  };

  // Handle player move
  const onDrop = (sourceSquare, targetSquare, piece) => {
    if (isThinking || gameStatus !== 'playing') return false;
    
    // Check if it's player's turn
    const turn = game.turn();
    const isPlayerTurn = (playerColor === 'white' && turn === 'w') || 
                         (playerColor === 'black' && turn === 'b');
    
    if (!isPlayerTurn) return false;
    
    try {
      const gameCopy = new Chess(game.fen());
      const moveResult = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to queen
      });
      
      if (moveResult === null) return false;
      
      setGame(gameCopy);
      setPosition(gameCopy.fen());
      setMoveHistory(prev => [...prev, moveResult.san]);
      setLastMove({ from: sourceSquare, to: targetSquare });
      
      // Track captured pieces
      if (moveResult.captured) {
        const capturedColor = moveResult.color === 'w' ? 'black' : 'white';
        setCapturedPieces(prev => ({
          ...prev,
          [capturedColor]: [...prev[capturedColor], moveResult.captured]
        }));
      }
      
      // Check game state
      if (gameCopy.isGameOver()) {
        handleGameOver(gameCopy);
        return true;
      }
      
      // Engine's turn
      setTimeout(() => makeEngineMove(gameCopy), 300);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Reset game
  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setPosition('start');
    setMoveHistory([]);
    setGameStatus('playing');
    setLastMove(null);
    setCapturedPieces({ white: [], black: [] });
    
    if (playerColor === 'black') {
      setTimeout(() => makeEngineMove(newGame), 500);
    }
  };

  // Resign
  const handleResign = () => {
    setGameStatus('ended');
    onGameEnd('enemy');
  };

  // Get piece symbols for captured display
  const getPieceSymbol = (piece, color) => {
    const symbols = {
      white: { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕' },
      black: { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛' }
    };
    return symbols[color]?.[piece] || '';
  };

  // Custom square styles for last move highlight
  const customSquareStyles = {};
  if (lastMove) {
    customSquareStyles[lastMove.from] = {
      backgroundColor: 'rgba(255, 255, 0, 0.4)'
    };
    customSquareStyles[lastMove.to] = {
      backgroundColor: 'rgba(255, 255, 0, 0.4)'
    };
  }

  const isPlayerTurn = (playerColor === 'white' && game.turn() === 'w') || 
                       (playerColor === 'black' && game.turn() === 'b');

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center gap-8 p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" />

      {/* Game Info Panel - Left */}
      <div className="relative z-10 w-full lg:w-72 order-2 lg:order-1">
        <div 
          className="rounded-xl p-6"
          style={{
            background: 'linear-gradient(180deg, rgba(30,30,50,0.95) 0%, rgba(15,15,30,0.98) 100%)',
            border: `2px solid ${enemy?.color || '#ff0080'}40`
          }}
        >
          {/* Enemy Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <span className="text-4xl" style={{ filter: `drop-shadow(0 0 10px ${enemy?.color})` }}>
              {enemy?.avatar}
            </span>
            <div>
              <h3 
                className="text-lg font-bold tracking-wide"
                style={{ fontFamily: 'Orbitron, sans-serif', color: enemy?.color }}
              >
                {enemy?.name}
              </h3>
              <p className="text-xs text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {enemy?.difficulty}
              </p>
            </div>
          </div>

          {/* Turn Indicator */}
          <div className="mb-6">
            <div 
              className={`flex items-center justify-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 ${isThinking ? 'animate-pulse' : ''}`}
              style={{
                background: isPlayerTurn 
                  ? 'linear-gradient(135deg, #00ff8840 0%, #00ff4420 100%)'
                  : `linear-gradient(135deg, ${enemy?.color}40 0%, ${enemy?.color}20 100%)`,
                border: `1px solid ${isPlayerTurn ? '#00ff88' : enemy?.color}`
              }}
            >
              {isThinking ? (
                <>
                  <Zap size={18} className="animate-pulse" style={{ color: enemy?.color }} />
                  <span style={{ fontFamily: 'Orbitron, sans-serif', color: enemy?.color, fontSize: '14px' }}>
                    THINKING...
                  </span>
                </>
              ) : (
                <span 
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif', 
                    color: isPlayerTurn ? '#00ff88' : enemy?.color,
                    fontSize: '14px'
                  }}
                >
                  {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT TURN'}
                </span>
              )}
            </div>
          </div>

          {/* Captured Pieces */}
          <div className="mb-6">
            <h4 className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              CAPTURED
            </h4>
            <div className="flex flex-wrap gap-1 min-h-[30px] p-2 rounded bg-black/30">
              {capturedPieces[playerColor === 'white' ? 'black' : 'white'].map((piece, i) => (
                <span key={i} className="text-xl">
                  {getPieceSymbol(piece, playerColor === 'white' ? 'black' : 'white')}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 min-h-[30px] p-2 rounded bg-white/10 mt-2">
              {capturedPieces[playerColor].map((piece, i) => (
                <span key={i} className="text-xl">
                  {getPieceSymbol(piece, playerColor)}
                </span>
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col gap-2">
            <button
              data-testid="back-btn"
              onClick={onBack}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px' }}
            >
              <ArrowLeft size={16} />
              BACK
            </button>
            <button
              data-testid="reset-btn"
              onClick={resetGame}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 transition-all"
              style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px' }}
            >
              <RotateCcw size={16} />
              RESET
            </button>
            <button
              data-testid="resign-btn"
              onClick={handleResign}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all"
              style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px' }}
            >
              <Flag size={16} />
              RESIGN
            </button>
          </div>
        </div>
      </div>

      {/* Chess Board - Center */}
      <div className="relative z-10 order-1 lg:order-2">
        <div 
          className="chess-board-container p-2 rounded-xl"
          style={{
            background: 'linear-gradient(180deg, rgba(30,30,50,0.9) 0%, rgba(15,15,30,0.95) 100%)',
            boxShadow: `0 0 60px ${enemy?.color}30, 0 0 120px ${enemy?.color}10`
          }}
        >
          <Chessboard
            id="chess-board"
            position={position}
            onPieceDrop={onDrop}
            boardWidth={Math.min(560, window.innerWidth - 40)}
            boardOrientation={playerColor}
            customBoardStyle={{
              borderRadius: '8px',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
            }}
            customSquareStyles={customSquareStyles}
            customDarkSquareStyle={{ backgroundColor: '#4a5568' }}
            customLightSquareStyle={{ backgroundColor: '#a0aec0' }}
            animationDuration={200}
          />
        </div>
        
        {/* Status indicator */}
        {game.isCheck() && !game.isCheckmate() && (
          <div 
            className="absolute -top-12 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #ff0040 0%, #ff4000 100%)',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '14px',
              animation: 'pulse 1s infinite'
            }}
          >
            CHECK!
          </div>
        )}
      </div>

      {/* Move History - Right */}
      <div className="relative z-10 w-full lg:w-64 order-3">
        <div 
          className="rounded-xl p-6"
          style={{
            background: 'linear-gradient(180deg, rgba(30,30,50,0.95) 0%, rgba(15,15,30,0.98) 100%)',
            border: '2px solid rgba(255,255,255,0.1)'
          }}
        >
          <h3 
            className="text-sm font-bold tracking-wider mb-4 text-gray-400"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            MOVE HISTORY
          </h3>
          
          <div 
            className="h-64 overflow-y-auto pr-2 custom-scrollbar"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {moveHistory.length === 0 ? (
              <p className="text-gray-600 text-sm">No moves yet</p>
            ) : (
              <div className="space-y-1">
                {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/5"
                  >
                    <span className="text-gray-600 w-6 text-xs">{i + 1}.</span>
                    <span className="text-white flex-1">{moveHistory[i * 2]}</span>
                    <span className="text-gray-400 flex-1">{moveHistory[i * 2 + 1] || ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Player Color Indicator */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                PLAYING AS
              </span>
              <span 
                className="text-2xl"
                style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }}
              >
                {playerColor === 'white' ? '♔' : '♚'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};

export default ChessGame;
