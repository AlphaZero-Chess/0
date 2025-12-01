// AlphaZero Engine Configuration - Ported from Lichess Bot
const CONFIG = {
  thinkingTimeMin: 150,
  thinkingTimeMax: 800,
  humanMistakeRate: 0,
  baseDepth: 18,
  tacticalDepth: 22,
  positionalDepth: 20,
  endgameDepth: 24,
  openingDepth: 16,
  aggressionFactor: 0.85,
};

// AlphaZero Opening Book - Aggressive, Sacrificial, Initiative-Based
const OPENINGS = {
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "e2e4", weight: 0.55 },
      { move: "d2d4", weight: 0.30 },
      { move: "c2c4", weight: 0.10 },
      { move: "g1f3", weight: 0.05 }
    ]
  },
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -": {
    black: [
      { move: "c7c5", weight: 0.45 },
      { move: "e7e5", weight: 0.30 },
      { move: "e7e6", weight: 0.15 },
      { move: "c7c6", weight: 0.10 }
    ]
  },
  "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq -": {
    black: [
      { move: "g8f6", weight: 0.40 },
      { move: "d7d5", weight: 0.35 },
      { move: "f7f5", weight: 0.15 },
      { move: "e7e6", weight: 0.10 }
    ]
  },
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "g1f3", weight: 0.50 },
      { move: "b1c3", weight: 0.25 },
      { move: "c2c3", weight: 0.15 },
      { move: "f2f4", weight: 0.10 }
    ]
  },
  "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "g1f3", weight: 0.45 },
      { move: "b1c3", weight: 0.30 },
      { move: "f1c4", weight: 0.15 },
      { move: "f2f4", weight: 0.10 }
    ]
  },
  "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
    white: [
      { move: "f1c4", weight: 0.40 },
      { move: "f1b5", weight: 0.35 },
      { move: "d2d4", weight: 0.25 }
    ]
  },
  "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq -": {
    black: [
      { move: "e7e6", weight: 0.40 },
      { move: "c7c6", weight: 0.30 },
      { move: "d5c4", weight: 0.20 },
      { move: "g8f6", weight: 0.10 }
    ]
  },
  "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq -": {
    white: [
      { move: "c2c4", weight: 0.50 },
      { move: "g1f3", weight: 0.30 },
      { move: "b1c3", weight: 0.20 }
    ]
  }
};

function countPieces(fen) {
  let count = 0;
  const board = fen.split(' ')[0];
  for (let i = 0; i < board.length; i++) {
    const char = board[i];
    if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
      count++;
    }
  }
  return count;
}

function getGamePhase(moveNum, fen) {
  const pieces = countPieces(fen);
  if (moveNum <= 8) return "opening";
  if (moveNum <= 14 && pieces > 28) return "early-middlegame";
  if (pieces > 22) return "middlegame";
  if (pieces > 14) return "late-middlegame";
  return "endgame";
}

function getDepth(phase) {
  if (phase === "opening") return CONFIG.openingDepth;
  if (phase === "endgame") return CONFIG.endgameDepth;
  if (phase === "middlegame" || phase === "late-middlegame") return CONFIG.tacticalDepth;
  return CONFIG.baseDepth;
}

function getBookMove(fen, color) {
  // Normalize FEN for lookup (remove move counters)
  const fenParts = fen.split(' ');
  const fenKey = fenParts.slice(0, 4).join(' ');
  
  // Try exact match first
  let position = OPENINGS[fenKey];
  
  // Try without en passant
  if (!position) {
    const fenKey2 = fenParts.slice(0, 3).join(' ') + ' -';
    position = OPENINGS[fenKey2];
  }
  
  if (!position) return null;
  
  const moves = color === 'w' ? position.white : position.black;
  if (!moves || moves.length === 0) return null;
  
  // AlphaZero prefers aggressive lines
  const aggressionBoost = CONFIG.aggressionFactor;
  let adjustedMoves = moves.map((m, idx) => ({
    ...m,
    weight: m.weight * (idx === 0 ? aggressionBoost + 0.15 : 1)
  }));
  
  const totalWeight = adjustedMoves.reduce((sum, m) => sum + m.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let moveOption of adjustedMoves) {
    random -= moveOption.weight;
    if (random <= 0) return moveOption.move;
  }
  
  return moves[0].move;
}

// Convert UCI move (e2e4) to object format {from: 'e2', to: 'e4'}
function uciToMove(uci) {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci.length > 4 ? uci[4] : undefined
  };
}

class AlphaZeroEngine {
  constructor() {
    this.engine = null;
    this.isReady = false;
    this.pendingCallback = null;
  }

  async init() {
    return new Promise((resolve) => {
      // Create Web Worker for Stockfish
      this.engine = new Worker('/stockfish.js');
      
      this.engine.onmessage = (event) => {
        const line = event.data;
        
        if (line === 'uciok') {
          this.engine.postMessage('isready');
        } else if (line === 'readyok') {
          this.isReady = true;
          resolve();
        } else if (line.startsWith('bestmove')) {
          const parts = line.split(' ');
          const bestMove = parts[1];
          if (this.pendingCallback && bestMove && bestMove !== '(none)') {
            this.pendingCallback(uciToMove(bestMove));
            this.pendingCallback = null;
          }
        }
      };

      this.engine.postMessage('uci');
      // AlphaZero-style settings
      this.engine.postMessage('setoption name Contempt value 50');
      this.engine.postMessage('setoption name MultiPV value 1');
    });
  }

  async getBestMove(fen, moveNumber, callback) {
    const fenParts = fen.split(' ');
    const color = fenParts[1];
    
    // Try opening book first
    const bookMove = getBookMove(fen, color);
    if (bookMove && moveNumber <= 12) {
      // Add slight delay for realism
      setTimeout(() => {
        callback(uciToMove(bookMove));
      }, Math.random() * 300 + 200);
      return;
    }

    // Engine calculation
    const phase = getGamePhase(moveNumber, fen);
    const depth = getDepth(phase);
    
    this.pendingCallback = callback;
    this.engine.postMessage('position fen ' + fen);
    this.engine.postMessage('go depth ' + depth);
  }

  stop() {
    if (this.engine) {
      this.engine.postMessage('stop');
    }
  }
}

export default AlphaZeroEngine;
