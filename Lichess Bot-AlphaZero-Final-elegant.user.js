// ==UserScript==
// @name         Lichess Bot - AlphaZero 30s (Final Stable)
// @description  True AlphaZero-level elegance: hyper-aggressive, deep strategic mastery
// @author       AlphaZero - Final Edition
// @version      4.0.0-ALPHAZERO-MASTERY
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION - AlphaZero Mastery: Fearless, Relentless, Superhuman
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Timing - Confident, calculated responses
    thinkingTimeMin: 150,
    thinkingTimeMax: 800,
    
    // AlphaZero NEVER makes mistakes - perfect calculation
    humanMistakeRate: 0,
    
    // Depth - Maximum strength always
    baseDepth: 18,
    tacticalDepth: 22,
    positionalDepth: 20,
    endgameDepth: 24,
    openingDepth: 16,
    
    // Speed multipliers - Consistent superhuman pace
    openingSpeed: 0.5,
    earlyMidSpeed: 0.6,
    middlegameSpeed: 0.7,
    lateMidSpeed: 0.65,
    endgameSpeed: 0.55,
    criticalSpeed: 0.8,
    
    // AlphaZero NEVER panics - maintains full strength always
    panicThreshold: 0,
    criticalThreshold: 0
};

// ═══════════════════════════════════════════════════════════════════════
// OPENING BOOK - AlphaZero Signature Repertoire (All ECO Codes)
// Aggressive, Initiative-Based, Pawn Storm Ready
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // === STARTING POSITION (A00-E99) ===
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.55 },
            { move: "d2d4", weight: 0.35 },
            { move: "c2c4", weight: 0.07 },
            { move: "g1f3", weight: 0.03 }
        ]
    },
    
    // === SICILIAN DEFENSE (B20-B99) ===
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.55 },
            { move: "e7e5", weight: 0.25 },
            { move: "e7e6", weight: 0.12 },
            { move: "c7c6", weight: 0.08 }
        ]
    },
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.50 },
            { move: "b1c3", weight: 0.25 },
            { move: "c2c3", weight: 0.15 },
            { move: "f2f4", weight: 0.10 }
        ]
    },
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d6", weight: 0.40 },
            { move: "b8c6", weight: 0.30 },
            { move: "e7e6", weight: 0.20 },
            { move: "g8f6", weight: 0.10 }
        ]
    },
    
    // === QUEEN'S PAWN OPENINGS (D00-D99, E00-E99) ===
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.45 },
            { move: "d7d5", weight: 0.35 },
            { move: "e7e6", weight: 0.12 },
            { move: "f7f5", weight: 0.08 }
        ]
    },
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.40 },
            { move: "c7c6", weight: 0.30 },
            { move: "d5c4", weight: 0.18 },
            { move: "g8f6", weight: 0.12 }
        ]
    },
    
    // === KING'S INDIAN DEFENSE (E60-E99) ===
    "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "g8f6", weight: 0.50 },
            { move: "e7e5", weight: 0.25 },
            { move: "c7c5", weight: 0.15 },
            { move: "e7e6", weight: 0.10 }
        ]
    },
    "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g7g6", weight: 0.45 },
            { move: "e7e6", weight: 0.35 },
            { move: "c7c5", weight: 0.12 },
            { move: "d7d5", weight: 0.08 }
        ]
    },
    
    // === ITALIAN GAME (C50-C54) ===
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.45 },
            { move: "f8c5", weight: 0.40 },
            { move: "f8e7", weight: 0.10 },
            { move: "d7d6", weight: 0.05 }
        ]
    },
    
    // === RUY LOPEZ (C60-C99) ===
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.50 },
            { move: "g8f6", weight: 0.30 },
            { move: "f8c5", weight: 0.12 },
            { move: "d7d6", weight: 0.08 }
        ]
    },
    
    // === FRENCH DEFENSE (C00-C19) ===
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.60 },
            { move: "b1c3", weight: 0.25 },
            { move: "d2d3", weight: 0.10 },
            { move: "g1f3", weight: 0.05 }
        ]
    },
    
    // === CARO-KANN (B10-B19) ===
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.55 },
            { move: "b1c3", weight: 0.25 },
            { move: "c2c4", weight: 0.12 },
            { move: "g1f3", weight: 0.08 }
        ]
    },
    
    // === LONDON SYSTEM (D00) ===
    "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6": {
        white: [
            { move: "c2c4", weight: 0.45 },
            { move: "g1f3", weight: 0.30 },
            { move: "c1f4", weight: 0.15 },
            { move: "b1c3", weight: 0.10 }
        ]
    },
    
    // === NIMZO-INDIAN (E20-E59) ===
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq -": {
        black: [
            { move: "f8b4", weight: 0.55 },
            { move: "f8e7", weight: 0.25 },
            { move: "d7d5", weight: 0.12 },
            { move: "c7c5", weight: 0.08 }
        ]
    },
    
    // === SCOTCH GAME (C44-C45) ===
    "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
        black: [
            { move: "e5d4", weight: 0.60 },
            { move: "d7d6", weight: 0.25 },
            { move: "f8c5", weight: 0.10 },
            { move: "g8f6", weight: 0.05 }
        ]
    },
    
    // === ENGLISH OPENING (A10-A39) ===
    "rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNR w KQkq e6": {
        white: [
            { move: "b1c3", weight: 0.45 },
            { move: "g2g3", weight: 0.30 },
            { move: "g1f3", weight: 0.15 },
            { move: "d2d3", weight: 0.10 }
        ]
    },
    
    // === CATALAN (E00-E09) ===
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.50 },
            { move: "f8b4", weight: 0.25 },
            { move: "c7c5", weight: 0.15 },
            { move: "d7d6", weight: 0.10 }
        ]
    },
    
    // === GRUNFELD DEFENSE (D70-D99) ===
    "rnbqkb1r/ppp1pppp/5n2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6": {
        white: [
            { move: "c4d5", weight: 0.45 },
            { move: "g1f3", weight: 0.30 },
            { move: "c1f4", weight: 0.15 },
            { move: "d4d5", weight: 0.10 }
        ]
    },
    
    // === ADVANCED MIDDLEGAME ===
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "d2d3", weight: 0.40 },
            { move: "b1c3", weight: 0.30 },
            { move: "c2c3", weight: 0.20 },
            { move: "d2d4", weight: 0.10 }
        ]
    },
    
    // === DRAGON SICILIAN (B70-B79) ===
    "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
        white: [
            { move: "f2f3", weight: 0.40 },
            { move: "c1e3", weight: 0.35 },
            { move: "f1c4", weight: 0.15 },
            { move: "f1e2", weight: 0.10 }
        ]
    },
    
    // === NAJDORF SICILIAN (B90-B99) ===
    "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
        white: [
            { move: "c1e3", weight: 0.35 },
            { move: "f1e2", weight: 0.30 },
            { move: "f2f3", weight: 0.20 },
            { move: "c1g5", weight: 0.15 }
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE
// ═══════════════════════════════════════════════════════════════════════

let chessEngine;
let currentFen = "";
let bestMove;
let webSocketWrapper = null;
let gamePhase = "opening";
let positionType = "normal";
let multiPVLines = [];
let myColor = null;
let moveCount = 0;
let timeRemaining = 30000;

// ═══════════════════════════════════════════════════════════════════════
// OPTIMIZED ALPHAZERO-STYLE HELPERS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Fast piece counting (optimized, no regex)
 */
function countPieces(fen) {
    let count = 0;
    const board = fen.split(' ')[0];
    for (let i = 0; i < board.length; i++) {
        const char = board[i];
        if (char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z') {
            count++;
        }
    }
    return count;
}

/**
 * Game phase detection (5 phases for AlphaZero-like adaptation)
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    
    if (moveNum <= 10) return "opening";
    if (moveNum <= 15 && pieces > 28) return "early-middlegame";
    if (pieces > 20) return "middlegame";
    if (pieces > 12) return "late-middlegame";
    return "endgame";
}

/**
 * AlphaZero-style position type detection
 */
function analyzePositionType(fen) {
    // Check for check (tactical priority)
    if (fen.indexOf("+") !== -1) return "tactical";
    
    // Count slashes for open files
    let slashes = 0;
    for (let i = 0; i < fen.length; i++) {
        if (fen[i] === '/') slashes++;
    }
    if (slashes > 6) return "tactical";
    
    // Check for pawn chains
    if (fen.indexOf("pp") !== -1 || fen.indexOf("PP") !== -1) {
        return "positional";
    }
    
    return "normal";
}

/**
 * AlphaZero thinking time - Confident, calculated, never rushed
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // AlphaZero is consistently fast - no hesitation
    if (phase === "opening") speedMultiplier = CONFIG.openingSpeed;
    else if (phase === "early-middlegame") speedMultiplier = CONFIG.earlyMidSpeed;
    else if (phase === "middlegame") speedMultiplier = CONFIG.middlegameSpeed;
    else if (phase === "late-middlegame") speedMultiplier = CONFIG.lateMidSpeed;
    else if (phase === "endgame") speedMultiplier = CONFIG.endgameSpeed;
    
    // Complex positions get slightly more time
    if (posType === "tactical") {
        speedMultiplier *= CONFIG.criticalSpeed;
    } else if (posType === "positional") {
        speedMultiplier *= 1.05;
    }
    
    // AlphaZero NEVER panics - only minor speed adjustment
    if (timeLeft < 5000) speedMultiplier *= 0.7;
    else if (timeLeft < 10000) speedMultiplier *= 0.85;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance);
    return Math.floor(Math.max(100, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * AlphaZero depth - Maximum strength always
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "endgame") {
        depth = CONFIG.endgameDepth;
    } else if (phase === "middlegame" || phase === "late-middlegame" || phase === "early-middlegame") {
        if (posType === "tactical") {
            depth = CONFIG.tacticalDepth;
        } else if (posType === "positional") {
            depth = CONFIG.positionalDepth;
        }
    }
    
    // AlphaZero maintains strength - minimal depth reduction
    if (timeLeft < 3000) depth = Math.max(14, depth - 2);
    else if (timeLeft < 5000) depth = Math.max(16, depth - 1);
    
    return depth;
}

/**
 * AlphaZero weighted opening book
 */
function getBookMove(fen) {
    const fenKey = fen.split(' ').slice(0, 4).join(' ');
    const position = OPENINGS[fenKey];
    
    if (!position) return null;
    
    const moves = myColor === 'w' ? position.white : position.black;
    if (!moves || moves.length === 0) return null;
    
    const totalWeight = moves.reduce((sum, m) => sum + m.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let moveOption of moves) {
        random -= moveOption.weight;
        if (random <= 0) return moveOption.move;
    }
    
    return moves[0].move;
}

/**
 * AlphaZero NEVER makes mistakes - always plays the best move
 */
function selectBestMove(bestMove, alternatives) {
    // AlphaZero always plays the objectively best move
    return bestMove;
}

/**
 * Fast multi-PV parsing
 */
function parseMultiPV(output) {
    const lines = output.split('\n');
    const pvLines = [];
    
    for (let line of lines) {
        if (line.indexOf('multipv') !== -1) {
            const pvMatch = line.match(/pv\s+(\w+)/);
            const scoreMatch = line.match(/score\s+cp\s+(-?\d+)/);
            
            if (pvMatch) {
                pvLines.push({
                    move: pvMatch[1],
                    score: scoreMatch ? parseInt(scoreMatch[1]) : 0
                });
            }
        }
    }
    
    return pvLines.sort((a, b) => b.score - a.score);
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION (Stable - EXACT SAME AS BACKUP)
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    chessEngine.postMessage("setoption name MultiPV value 2");
    chessEngine.postMessage("setoption name Contempt value 30");
    chessEngine.postMessage("setoption name Move Overhead value 50");
    chessEngine.postMessage("isready");
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION (EXACT SAME AS BACKUP)
// ═══════════════════════════════════════════════════════════════════════

function interceptWebSocket() {
    let webSocket = window.WebSocket;
    const webSocketProxy = new Proxy(webSocket, {
        construct: function (target, args) {
            let wrappedWebSocket = new target(...args);
            webSocketWrapper = wrappedWebSocket;

            wrappedWebSocket.addEventListener("message", function (event) {
                let message = JSON.parse(event.data);
                
                if (message.d && typeof message.d.fen === "string" && typeof message.v === "number") {
                    currentFen = message.d.fen;
                    
                    let isWhitesTurn = message.v % 2 == 0;
                    myColor = isWhitesTurn ? 'w' : 'b';
                    
                    if (isWhitesTurn) {
                        currentFen += " w";
                    } else {
                        currentFen += " b";
                    }
                    
                    moveCount = Math.floor(message.v / 2) + 1;
                    gamePhase = getGamePhase(moveCount, currentFen);
                    positionType = analyzePositionType(currentFen);
                    
                    calculateMove();
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// MOVE CALCULATION (EXACT SAME FLOW AS BACKUP)
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book - AlphaZero's signature repertoire
    if (gamePhase === "opening" || gamePhase === "early-middlegame") {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            const thinkTime = Math.random() * 300 + 250;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // Engine calculation
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    const thinkTime = getThinkTime(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
    chessEngine.postMessage("position fen " + currentFen);
    chessEngine.postMessage(`go depth ${depth}`);
    
    setTimeout(() => {
        // Handled by engine message callback
    }, thinkTime);
}

/**
 * Send move - AlphaZero style (confident, precise)
 */
function sendMove(move) {
    webSocketWrapper.send(JSON.stringify({
        t: "move",
        d: { 
            u: move, 
            b: 1,
            l: Math.floor(Math.random() * 30) + 20,
            a: 1
        }
    }));
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER (EXACT SAME AS BACKUP)
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    
    chessEngine.onmessage = function (event) {
        engineOutput += event + "\n";
        
        if (event.indexOf('multipv') !== -1) {
            const lines = parseMultiPV(event);
            if (lines.length > 0) {
                multiPVLines = lines;
            }
        }
        
        if (event && event.indexOf('bestmove') !== -1) {
            const moveParts = event.split(" ");
            bestMove = moveParts[1];
            
            // AlphaZero ALWAYS plays the best move - no variance
            let finalMove = selectBestMove(bestMove, multiPVLines);
            
            sendMove(finalMove);
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION (EXACT SAME AS BACKUP - NO TRY-CATCH)
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();
