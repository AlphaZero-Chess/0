import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import AlphaZeroEngine from './engine';

// Chess piece Unicode symbols
const PIECES = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
};

function getPieceSymbol(piece) {
  if (!piece) return null;
  const key = piece.color + piece.type.toUpperCase();
  return PIECES[key];
}

function Square({ piece, isLight, isSelected, isLegalMove, isCapture, isLastMove, onClick }) {
  let className = `square ${isLight ? 'light' : 'dark'}`;
  if (isSelected) className += ' selected';
  if (isLastMove) className += ' last-move';
  if (isLegalMove && !piece) className += ' legal-move';
  if (isCapture) className += ' legal-capture';
  
  return (
    <div className={className} onClick={onClick}>
      {piece && <span className="piece">{getPieceSymbol(piece)}</span>}
    </div>
  );
}

function PromotionModal({ onSelect }) {
  const pieces = ['q', 'r', 'b', 'n'];
  const symbols = ['♛', '♜', '♝', '♞'];
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Promote Pawn</h3>
        <div className="flex gap-4">
          {pieces.map((p, i) => (
            <button
              key={p}
              onClick={() => onSelect(p)}
              className="w-16 h-16 text-4xl bg-gray-100 hover:bg-blue-200 rounded-lg transition"
            >
              {symbols[i]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Board size constraints
const MIN_BOARD_SIZE = 200;
const MAX_BOARD_SIZE = 700;
const DEFAULT_BOARD_SIZE = 448;

export default function App() {
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [playerColor, setPlayerColor] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState('');
  const [moveHistory, setMoveHistory] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [showPromotion, setShowPromotion] = useState(null);
  const [engineReady, setEngineReady] = useState(false);
  const [boardSize, setBoardSize] = useState(() => {
    const saved = localStorage.getItem('chessBoardSize');
    return saved ? parseInt(saved, 10) : DEFAULT_BOARD_SIZE;
  });
  const engineRef = useRef(null);
  const moveCountRef = useRef(0);
  const boardRef = useRef(null);
  const isResizingRef = useRef(false);

  // Save board size to localStorage
  useEffect(() => {
    localStorage.setItem('chessBoardSize', boardSize.toString());
  }, [boardSize]);

  // Handle resize drag
  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.body.style.cursor = 'nwse-resize';
    document.body.style.userSelect = 'none';

    const startX = e.clientX || e.touches?.[0]?.clientX;
    const startY = e.clientY || e.touches?.[0]?.clientY;
    const startSize = boardSize;

    const handleMove = (moveEvent) => {
      if (!isResizingRef.current) return;
      const currentX = moveEvent.clientX || moveEvent.touches?.[0]?.clientX;
      const currentY = moveEvent.clientY || moveEvent.touches?.[0]?.clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      const delta = Math.max(deltaX, deltaY);
      const newSize = Math.min(MAX_BOARD_SIZE, Math.max(MIN_BOARD_SIZE, startSize + delta));
      setBoardSize(newSize);
    };

    const handleEnd = () => {
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  }, [boardSize]);

  // Initialize engine
  useEffect(() => {
    const initEngine = async () => {
      engineRef.current = new AlphaZeroEngine();
      await engineRef.current.init();
      setEngineReady(true);
    };
    initEngine();
  }, []);

  // Update board from game state
  const updateBoard = useCallback((gameInstance) => {
    const newBoard = [];
    for (let row = 0; row < 8; row++) {
      const boardRow = [];
      for (let col = 0; col < 8; col++) {
        const square = String.fromCharCode(97 + col) + (8 - row);
        boardRow.push({
          square,
          piece: gameInstance.get(square)
        });
      }
      newBoard.push(boardRow);
    }
    setBoard(newBoard);
  }, []);

  // Check game status
  const checkGameStatus = useCallback((gameInstance) => {
    if (gameInstance.isCheckmate()) {
      const winner = gameInstance.turn() === 'w' ? 'Black' : 'White';
      setGameStatus(`Checkmate! ${winner} wins!`);
      return true;
    }
    if (gameInstance.isStalemate()) {
      setGameStatus('Stalemate! Draw.');
      return true;
    }
    if (gameInstance.isDraw()) {
      setGameStatus('Draw!');
      return true;
    }
    if (gameInstance.isCheck()) {
      setGameStatus('Check!');
      return false;
    }
    setGameStatus('');
    return false;
  }, []);

  // Make AI move
  const makeAIMove = useCallback((gameInstance) => {
    if (!engineRef.current || !engineReady) return;
    
    setIsThinking(true);
    const fen = gameInstance.fen();
    
    engineRef.current.getBestMove(fen, moveCountRef.current, (move) => {
      try {
        const result = gameInstance.move(move);
        if (result) {
          moveCountRef.current++;
          setLastMove({ from: move.from, to: move.to });
          setMoveHistory(prev => [...prev, result.san]);
          updateBoard(gameInstance);
          setGame(new Chess(gameInstance.fen()));
          checkGameStatus(gameInstance);
        }
      } catch (e) {
        console.error('AI move error:', e);
      }
      setIsThinking(false);
    });
  }, [engineReady, updateBoard, checkGameStatus]);

  // Start new game
  const startGame = useCallback((color) => {
    const newGame = new Chess();
    setGame(newGame);
    setPlayerColor(color);
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveHistory([]);
    setLastMove(null);
    setGameStatus('');
    moveCountRef.current = 0;
    updateBoard(newGame);

    // If player is black, AI moves first
    if (color === 'b') {
      setTimeout(() => makeAIMove(newGame), 500);
    }
  }, [updateBoard, makeAIMove]);

  // Handle square click
  const handleSquareClick = (square, piece) => {
    if (!game || isThinking || game.isGameOver()) return;
    if (game.turn() !== playerColor) return;

    // If a piece is already selected
    if (selectedSquare) {
      const move = legalMoves.find(m => m.to === square);
      
      if (move) {
        // Check for promotion
        if (move.promotion) {
          setShowPromotion({ from: selectedSquare, to: square });
          return;
        }
        
        // Make the move
        try {
          const result = game.move({ from: selectedSquare, to: square });
          if (result) {
            moveCountRef.current++;
            setLastMove({ from: selectedSquare, to: square });
            setMoveHistory(prev => [...prev, result.san]);
            updateBoard(game);
            setGame(new Chess(game.fen()));
            
            if (!checkGameStatus(game)) {
              setTimeout(() => makeAIMove(game), 300);
            }
          }
        } catch (e) {
          console.error('Move error:', e);
        }
      }
      
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    // Select a piece
    if (piece && piece.color === playerColor) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves);
    }
  };

  // Handle promotion
  const handlePromotion = (promotionPiece) => {
    if (!showPromotion) return;
    
    try {
      const result = game.move({
        from: showPromotion.from,
        to: showPromotion.to,
        promotion: promotionPiece
      });
      
      if (result) {
        moveCountRef.current++;
        setLastMove({ from: showPromotion.from, to: showPromotion.to });
        setMoveHistory(prev => [...prev, result.san]);
        updateBoard(game);
        setGame(new Chess(game.fen()));
        
        if (!checkGameStatus(game)) {
          setTimeout(() => makeAIMove(game), 300);
        }
      }
    } catch (e) {
      console.error('Promotion error:', e);
    }
    
    setShowPromotion(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  // Flip board for black
  const displayBoard = playerColor === 'b' ? [...board].reverse().map(row => [...row].reverse()) : board;

  // Calculate piece size based on board size
  const pieceSize = `${boardSize / 8 * 0.75}px`;

  // Game selection screen
  if (!playerColor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">AlphaZero Chess</h1>
          <p className="text-xl text-gray-300">Play against superhuman AI offline</p>
          {!engineReady && (
            <p className="text-yellow-400 mt-4 thinking">Loading engine...</p>
          )}
        </div>
        
        <div className="flex gap-8">
          <button
            onClick={() => startGame('w')}
            disabled={!engineReady}
            className="bg-white text-gray-900 px-12 py-6 rounded-xl text-2xl font-bold hover:bg-gray-100 transition shadow-lg disabled:opacity-50"
          >
            ♔ Play as White
          </button>
          <button
            onClick={() => startGame('b')}
            disabled={!engineReady}
            className="bg-gray-800 text-white px-12 py-6 rounded-xl text-2xl font-bold hover:bg-gray-700 transition shadow-lg border-2 border-gray-600 disabled:opacity-50"
          >
            ♚ Play as Black
          </button>
        </div>
        
        <div className="mt-12 text-gray-400 text-center max-w-md">
          <p className="mb-2">🎯 AlphaZero-style aggressive play</p>
          <p className="mb-2">📚 Opening book with optimal lines</p>
          <p>🧠 Depth 16-24 superhuman calculation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-8">
      {showPromotion && <PromotionModal onSelect={handlePromotion} />}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4" style={{ width: boardSize }}>
        <div>
          <h1 className="text-2xl font-bold text-white">AlphaZero Chess</h1>
          <p className="text-gray-400">
            You: {playerColor === 'w' ? '♔ White' : '♚ Black'}
          </p>
        </div>
        <button
          onClick={() => setPlayerColor(null)}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          New Game
        </button>
      </div>

      {/* Status */}
      <div className="h-8 mb-2">
        {isThinking && (
          <div className="text-yellow-400 thinking font-semibold">
            AlphaZero is thinking...
          </div>
        )}
        {gameStatus && !isThinking && (
          <div className={`font-semibold ${gameStatus.includes('Checkmate') || gameStatus.includes('Draw') ? 'text-red-400' : 'text-yellow-400'}`}>
            {gameStatus}
          </div>
        )}
        {!isThinking && !gameStatus && (
          <div className="text-gray-400">
            {game?.turn() === playerColor ? 'Your turn' : "AlphaZero's turn"}
          </div>
        )}
      </div>

      {/* Chess Board with Resize Handle */}
      <div className="board-wrapper" style={{ width: boardSize }}>
        <div 
          ref={boardRef}
          className="chess-board"
          style={{ 
            width: boardSize,
            '--piece-size': pieceSize 
          }}
          data-testid="chess-board"
        >
          {displayBoard.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              const isLight = (rowIdx + colIdx) % 2 === 0;
              const isSelected = selectedSquare === cell.square;
              const legalMove = legalMoves.find(m => m.to === cell.square);
              const isLastMoveSquare = lastMove && (lastMove.from === cell.square || lastMove.to === cell.square);
              
              return (
                <Square
                  key={cell.square}
                  piece={cell.piece}
                  isLight={isLight}
                  isSelected={isSelected}
                  isLegalMove={!!legalMove}
                  isCapture={legalMove && cell.piece}
                  isLastMove={isLastMoveSquare}
                  onClick={() => handleSquareClick(cell.square, cell.piece)}
                />
              );
            })
          )}
        </div>
        {/* Resize Handle */}
        <div 
          className="cg-resize"
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
          data-testid="board-resize-handle"
        />
      </div>

      {/* Move History */}
      <div className="mt-6" style={{ width: boardSize }}>
        <h3 className="text-gray-400 mb-2">Move History</h3>
        <div className="bg-gray-800/50 rounded-lg p-3 min-h-16 max-h-32 overflow-y-auto">
          <div className="flex flex-wrap gap-1 text-sm text-gray-300">
            {moveHistory.map((move, idx) => (
              <span key={idx} className={idx % 2 === 0 ? 'text-white' : 'text-gray-400'}>
                {idx % 2 === 0 && <span className="text-gray-500 mr-1">{Math.floor(idx/2) + 1}.</span>}
                {move}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
