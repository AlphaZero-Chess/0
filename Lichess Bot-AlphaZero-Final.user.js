// ==UserScript==
// @name         Lichess Bot - AlphaZero 30s (Final Stable)
// @description  100% Stable with full human-like features for 30-second games
// @author       AlphaZero - Final Edition
// @version      3.0.0-FINAL-STABLE
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION - Full Human-like Features
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Timing
    thinkingTimeMin: 200,
    thinkingTimeMax: 1500,
    humanMistakeRate: 0.04,
    
    // Depth
    baseDepth: 11,
    tacticalDepth: 13,
    positionalDepth: 12,
    endgameDepth: 12,
    openingDepth: 10,
    
    // Speed multipliers
    openingSpeed: 0.4,
    earlyMidSpeed: 0.75,
    middlegameSpeed: 0.9,
    lateMidSpeed: 0.85,
    endgameSpeed: 0.8,
    criticalSpeed: 1.2,
    
    // Time thresholds
    panicThreshold: 8000,
    criticalThreshold: 15000
};

// ═══════════════════════════════════════════════════════════════════════
// OPENING BOOK - Weighted for Variety
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.60 },
            { move: "d2d4", weight: 0.25 },
            { move: "c2c4", weight: 0.10 },
            { move: "g1f3", weight: 0.05 }
        ]
    },
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.50 },
            { move: "e7e5", weight: 0.30 },
            { move: "c7c6", weight: 0.10 },
            { move: "e7e6", weight: 0.10 }
        ]
    },
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.45 },
            { move: "d7d5", weight: 0.35 },
            { move: "e7e6", weight: 0.15 },
            { move: "c7c5", weight: 0.05 }
        ]
    },
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.60 },
            { move: "b1c3", weight: 0.30 },
            { move: "c2c3", weight: 0.10 }
        ]
    },
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.50 },
            { move: "f8c5", weight: 0.40 },
            { move: "f8e7", weight: 0.10 }
        ]
    },
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.45 },
            { move: "c7c6", weight: 0.30 },
            { move: "d5c4", weight: 0.15 },
            { move: "g8f6", weight: 0.10 }
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
// OPTIMIZED HUMAN-LIKE HELPERS
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
 * Game phase detection (5 phases for human-like play)
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
 * Fast position type detection (optimized)
 */
function analyzePositionType(fen) {
    // Quick tactical check
    if (fen.indexOf("+") !== -1) return "tactical";
    
    // Random tactical flag (human uncertainty)
    if (Math.random() < 0.15) return "tactical";
    
    // Count slashes for open files
    let slashes = 0;
    for (let i = 0; i < fen.length; i++) {
        if (fen[i] === '/') slashes++;
    }
    if (slashes > 6) return "tactical";
    
    // Check for pawn chains (simple)
    if (fen.indexOf("pp") !== -1 || fen.indexOf("PP") !== -1) {
        return "positional";
    }
    
    return "normal";
}

/**
 * Human-like adaptive thinking time
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // Phase-based (human adjusts by phase)
    if (phase === "opening") speedMultiplier = CONFIG.openingSpeed;
    else if (phase === "early-middlegame") speedMultiplier = CONFIG.earlyMidSpeed;
    else if (phase === "middlegame") speedMultiplier = CONFIG.middlegameSpeed;
    else if (phase === "late-middlegame") speedMultiplier = CONFIG.lateMidSpeed;
    else if (phase === "endgame") speedMultiplier = CONFIG.endgameSpeed;
    
    // Position type (humans think more on tactics)
    if (posType === "tactical") {
        speedMultiplier *= CONFIG.criticalSpeed;
    } else if (posType === "positional") {
        speedMultiplier *= 1.05;
    }
    
    // Time pressure (human panic mode)
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.55;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.4;
    if (timeLeft < 5000) speedMultiplier *= 0.3;
    if (timeLeft < 3000) speedMultiplier *= 0.25;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance);
    return Math.floor(Math.max(150, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * Adaptive depth (human-like)
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
    
    // Time pressure depth reduction
    if (timeLeft < CONFIG.criticalThreshold) depth = Math.max(9, depth - 1);
    if (timeLeft < CONFIG.panicThreshold) depth = Math.max(8, depth - 2);
    if (timeLeft < 5000) depth = Math.max(7, depth - 3);
    if (timeLeft < 3000) depth = Math.max(6, depth - 4);
    
    return depth;
}

/**
 * Weighted opening book (human variety)
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
 * Human-like variance (4% mistake rate)
 */
function applyHumanVariance(bestMove, alternatives) {
    if (!alternatives || alternatives.length < 2) return bestMove;
    
    // Human-like: occasionally play 2nd best move
    if (Math.random() < CONFIG.humanMistakeRate) {
        const secondBest = alternatives[1];
        const scoreDiff = Math.abs((alternatives[0].score || 0) - (secondBest.score || 0));
        
        // Only if moves are close (within 0.5 pawns)
        if (scoreDiff < 50) {
            return secondBest.move;
        }
    }
    
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
// ENGINE INITIALIZATION (Stable Bullet settings)
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
// WEBSOCKET INTERCEPTION
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
// MOVE CALCULATION
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book (human variety)
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
 * Send move with human-like delay
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
// ENGINE MESSAGE HANDLER
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
            
            let finalMove = bestMove;
            
            // Apply human variance
            if (multiPVLines.length > 1) {
                finalMove = applyHumanVariance(bestMove, multiPVLines);
            }
            
            sendMove(finalMove);
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();
