// ==UserScript==
// @name         Lichess Bot - AlphaZero Mastery Edition
// @description  True AlphaZero-style play: Aggressive, Strategic, Flawless
// @author       AlphaZero - Mastery Edition
// @version      4.0.0-ALPHAZERO-MASTERY
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO MASTERY CONFIGURATION
// Hyper-aggressive, deep strategic, flawless execution
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // AlphaZero Timing - Calculated brilliance, never rushed
    thinkingTimeMin: 150,
    thinkingTimeMax: 800,
    
    // AlphaZero NEVER makes mistakes - infallible precision
    humanMistakeRate: 0,
    
    // Superior Depth - Deep calculation like AlphaZero's neural evaluation
    baseDepth: 16,
    tacticalDepth: 20,
    positionalDepth: 18,
    endgameDepth: 22,
    openingDepth: 14,
    
    // AlphaZero maintains FULL STRENGTH always - no speed reduction
    openingSpeed: 1.0,
    earlyMidSpeed: 1.0,
    middlegameSpeed: 1.0,
    lateMidSpeed: 1.0,
    endgameSpeed: 1.0,
    criticalSpeed: 1.0,
    
    // AlphaZero NEVER panics - maintains full strength always
    panicThreshold: 0,
    criticalThreshold: 0,
    
    // AlphaZero Aggression Parameters
    aggressionLevel: 95,
    sacrificeTendency: 80,
    pawnStormPropensity: 85,
    prophylaxisWeight: 90,
    initiativeValue: 95,
    
    // Strategic Depth
    longTermPlanWeight: 90,
    pieceActivityBonus: 85,
    kingAttackWeight: 90,
    centralControlWeight: 88
};

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO OPENING BOOK - Aggressive, Strategic Mastery
// Covers all major ECO codes with AlphaZero's aggressive preferences
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // ═══════════════════════════════════════════════════════════════════
    // STARTING POSITION - AlphaZero prefers dynamic openings
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.55 },  // King's Pawn - aggressive
            { move: "d2d4", weight: 0.35 },  // Queen's Pawn - strategic
            { move: "c2c4", weight: 0.08 },  // English - positional
            { move: "g1f3", weight: 0.02 }   // Reti - hypermodern
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // SICILIAN DEFENSE (B20-B99) - AlphaZero's favorite weapon
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.65 },  // Sicilian - aggressive counter
            { move: "e7e5", weight: 0.20 },  // Open Game
            { move: "e7e6", weight: 0.10 },  // French
            { move: "c7c6", weight: 0.05 }   // Caro-Kann
        ]
    },
    
    // Sicilian: Open Sicilian
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.70 },  // Open Sicilian - aggressive
            { move: "b1c3", weight: 0.20 },  // Closed Sicilian
            { move: "c2c3", weight: 0.10 }   // Alapin
        ]
    },
    
    // Sicilian: Najdorf preparation
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d6", weight: 0.50 },  // Najdorf/Dragon setup
            { move: "b8c6", weight: 0.30 },  // Classical
            { move: "e7e6", weight: 0.20 }   // Scheveningen
        ]
    },
    
    // Sicilian Najdorf mainline
    "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.85 },  // Main line - aggressive
            { move: "f1b5", weight: 0.15 }   // Moscow variation
        ]
    },
    
    // Sicilian after d4 cxd4
    "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f3d4", weight: 1.0 }    // Recapture - standard
        ]
    },
    
    // Sicilian: Najdorf 6.Bg5 line
    "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
        white: [
            { move: "c1g5", weight: 0.45 },  // English Attack prep
            { move: "f1e2", weight: 0.30 },  // Classical
            { move: "f2f3", weight: 0.25 }   // English Attack
        ]
    },
    
    // Dragon Sicilian
    "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
        white: [
            { move: "f2f3", weight: 0.50 },  // Yugoslav Attack - brutal
            { move: "c1e3", weight: 0.35 },  // Yugoslav prep
            { move: "f1e2", weight: 0.15 }   // Classical
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // QUEEN'S PAWN OPENINGS (D00-D99, E00-E99)
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.45 },  // Indian Defenses
            { move: "d7d5", weight: 0.35 },  // Classical response
            { move: "e7e6", weight: 0.12 },  // QGD setup
            { move: "c7c5", weight: 0.08 }   // Benoni
        ]
    },
    
    // Queen's Gambit
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.40 },  // QGD - solid
            { move: "c7c6", weight: 0.35 },  // Slav - strategic
            { move: "d5c4", weight: 0.15 },  // QGA - tactical
            { move: "g8f6", weight: 0.10 }   // Various
        ]
    },
    
    // King's Indian Defense setup
    "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "c2c4", weight: 0.70 },  // Main lines
            { move: "g1f3", weight: 0.20 },  // Flexible
            { move: "c1g5", weight: 0.10 }   // Trompowsky
        ]
    },
    
    // King's Indian: Main line
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.75 },  // Main line
            { move: "g1f3", weight: 0.25 }   // Fianchetto
        ]
    },
    
    // King's Indian: Classical
    "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR w KQkq -": {
        white: [
            { move: "g1f3", weight: 0.50 },  // Classical
            { move: "f1e2", weight: 0.30 },  // Classical
            { move: "f2f3", weight: 0.20 }   // Sämisch - aggressive
        ]
    },
    
    // Nimzo-Indian
    "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
        white: [
            { move: "e2e3", weight: 0.40 },  // Rubinstein
            { move: "d1c2", weight: 0.35 },  // Classical
            { move: "c1g5", weight: 0.15 },  // Leningrad
            { move: "f2f3", weight: 0.10 }   // Sämisch
        ]
    },
    
    // Grünfeld Defense
    "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6": {
        white: [
            { move: "c4d5", weight: 0.50 },  // Exchange - main line
            { move: "g1f3", weight: 0.30 },  // Russian System
            { move: "c1f4", weight: 0.20 }   // Bf4 system
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // OPEN GAMES (C00-C99) - Italian, Spanish, etc.
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6": {
        white: [
            { move: "g1f3", weight: 0.80 },  // King's Knight
            { move: "f1c4", weight: 0.15 },  // Bishop's Opening
            { move: "b1c3", weight: 0.05 }   // Vienna
        ]
    },
    
    // Italian Game / Spanish setup
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "b8c6", weight: 0.90 },  // Main defense
            { move: "g8f6", weight: 0.10 }   // Petrov
        ]
    },
    
    // Italian vs Spanish choice
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f1b5", weight: 0.55 },  // Spanish (Ruy Lopez) - strategic
            { move: "f1c4", weight: 0.40 },  // Italian - tactical
            { move: "d2d4", weight: 0.05 }   // Scotch - direct
        ]
    },
    
    // Italian Game mainline
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.50 },  // Two Knights - aggressive
            { move: "f8c5", weight: 0.45 },  // Giuoco Piano
            { move: "f8e7", weight: 0.05 }   // Hungarian
        ]
    },
    
    // Giuoco Piano
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "c2c3", weight: 0.60 },  // Main line - pawn storm prep
            { move: "d2d3", weight: 0.25 },  // Giuoco Pianissimo
            { move: "b2b4", weight: 0.15 }   // Evans Gambit - aggressive!
        ]
    },
    
    // Evans Gambit - AlphaZero loves this!
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq b3": {
        black: [
            { move: "c5b4", weight: 0.80 },  // Accept gambit
            { move: "c5e7", weight: 0.20 }   // Decline
        ]
    },
    
    // Spanish (Ruy Lopez)
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.60 },  // Morphy Defense
            { move: "g8f6", weight: 0.25 },  // Berlin Defense
            { move: "f8c5", weight: 0.15 }   // Classical
        ]
    },
    
    // Spanish: Morphy Defense
    "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "b5a4", weight: 0.80 },  // Maintain tension
            { move: "b5c6", weight: 0.20 }   // Exchange variation
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // FRENCH DEFENSE (C00-C19)
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.85 },  // Main line
            { move: "d2d3", weight: 0.10 },  // King's Indian Attack
            { move: "b1c3", weight: 0.05 }   // Various
        ]
    },
    
    // French: Main line
    "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "d7d5", weight: 0.95 },  // Main line
            { move: "c7c5", weight: 0.05 }   // Franco-Sicilian
        ]
    },
    
    // French: Advance variation
    "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "c7c5", weight: 0.80 },  // Main counterplay
            { move: "c8d7", weight: 0.20 }   // Quiet
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // CARO-KANN DEFENSE (B10-B19)
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.75 },  // Main line
            { move: "b1c3", weight: 0.20 },  // Two Knights
            { move: "c2c4", weight: 0.05 }   // Panov Attack
        ]
    },
    
    // Caro-Kann: Classical
    "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Classical
            { move: "e4e5", weight: 0.30 },  // Advance
            { move: "e4d5", weight: 0.20 }   // Exchange
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // ENGLISH OPENING (A10-A39)
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e5", weight: 0.40 },  // Reversed Sicilian
            { move: "g8f6", weight: 0.35 },  // Indian setup
            { move: "c7c5", weight: 0.25 }   // Symmetrical
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // LONDON SYSTEM & TROMPOWSKY
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkb1r/pppppppp/5n2/6B1/3P4/8/PPP1PPPP/RN1QKBNR b KQkq -": {
        black: [
            { move: "e7e6", weight: 0.40 },  // Solid
            { move: "c7c5", weight: 0.35 },  // Aggressive
            { move: "d7d5", weight: 0.25 }   // Classical
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // BENONI & MODERN BENONI
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkb1r/pp1ppppp/5n2/2pP4/8/8/PPP1PPPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "e7e6", weight: 0.70 },  // Modern Benoni - dynamic
            { move: "d7d6", weight: 0.30 }   // Old Benoni
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // DUTCH DEFENSE
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq f6": {
        white: [
            { move: "c2c4", weight: 0.50 },  // Main line
            { move: "g1f3", weight: 0.30 },  // Flexible
            { move: "e2e4", weight: 0.20 }   // Staunton Gambit - aggressive!
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // SCANDINAVIAN DEFENSE
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6": {
        white: [
            { move: "e4d5", weight: 0.90 },  // Main - capture
            { move: "b1c3", weight: 0.10 }   // Delay
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // PIRC/MODERN DEFENSE
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.75 },  // Main aggressive
            { move: "b1c3", weight: 0.15 },  // Austrian Attack prep
            { move: "g1f3", weight: 0.10 }   // Quiet
        ]
    },
    
    // Pirc: Austrian Attack
    "rnbqkb1r/ppp1pp1p/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq f3": {
        black: [
            { move: "f8g7", weight: 0.90 },  // Fianchetto
            { move: "c7c5", weight: 0.10 }   // Counter
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // ALEKHINE'S DEFENSE
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e4e5", weight: 0.80 },  // Chase the knight - aggressive
            { move: "b1c3", weight: 0.20 }   // Quiet
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE - AlphaZero Mastery
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
let strategicContext = "neutral";

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO STRATEGIC HELPERS
// Superior evaluation, deep calculation, flawless execution
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
 * Count specific piece types for strategic analysis
 */
function countPieceTypes(fen) {
    const board = fen.split(' ')[0];
    let counts = { 
        wQ: 0, wR: 0, wB: 0, wN: 0, wP: 0,
        bQ: 0, bR: 0, bB: 0, bN: 0, bP: 0
    };
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        if (c === 'Q') counts.wQ++;
        else if (c === 'R') counts.wR++;
        else if (c === 'B') counts.wB++;
        else if (c === 'N') counts.wN++;
        else if (c === 'P') counts.wP++;
        else if (c === 'q') counts.bQ++;
        else if (c === 'r') counts.bR++;
        else if (c === 'b') counts.bB++;
        else if (c === 'n') counts.bN++;
        else if (c === 'p') counts.bP++;
    }
    return counts;
}

/**
 * Game phase detection - AlphaZero precision (7 phases)
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    const pieceCounts = countPieceTypes(fen);
    
    // Opening: first 10 moves with most pieces
    if (moveNum <= 8) return "opening";
    if (moveNum <= 12 && pieces > 28) return "early-middlegame";
    
    // Check for early endgame transitions
    const totalMinor = pieceCounts.wB + pieceCounts.wN + pieceCounts.bB + pieceCounts.bN;
    const totalRooks = pieceCounts.wR + pieceCounts.bR;
    const totalQueens = pieceCounts.wQ + pieceCounts.bQ;
    
    // Pure endgames
    if (pieces <= 8) return "pure-endgame";
    if (pieces <= 12 && totalQueens === 0) return "minor-piece-endgame";
    if (pieces <= 14 && totalQueens === 0 && totalMinor <= 2) return "rook-endgame";
    
    // Middlegame phases
    if (pieces > 22) return "middlegame";
    if (pieces > 16) return "late-middlegame";
    
    return "endgame";
}

/**
 * AlphaZero Position Analysis - Deep strategic understanding
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    const pieceCounts = countPieceTypes(fen);
    
    // Check indicators - tactical alertness
    if (fen.indexOf("+") !== -1) return "tactical-critical";
    
    // Pawn structure analysis
    let pawnTension = 0;
    let centralPawns = 0;
    const ranks = board.split('/');
    
    // Analyze center control (ranks 3-6, files d-e)
    for (let r = 2; r <= 5; r++) {
        let file = 0;
        for (let i = 0; i < ranks[r].length; i++) {
            const c = ranks[r][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (file >= 3 && file <= 4) {
                    if (c === 'P' || c === 'p') centralPawns++;
                    if (c === 'N' || c === 'n' || c === 'B' || c === 'b') pawnTension++;
                }
                file++;
            }
        }
    }
    
    // Open files for attack
    let openFiles = 0;
    for (let f = 0; f < 8; f++) {
        let hasPawn = false;
        for (let r = 0; r < 8; r++) {
            let file = 0;
            for (let i = 0; i < ranks[r].length && file <= f; i++) {
                const c = ranks[r][i];
                if (c >= '1' && c <= '8') {
                    file += parseInt(c);
                } else {
                    if (file === f && (c === 'P' || c === 'p')) hasPawn = true;
                    file++;
                }
            }
        }
        if (!hasPawn) openFiles++;
    }
    
    // Determine position type based on analysis
    if (openFiles >= 3 && pieceCounts.wR + pieceCounts.bR >= 2) return "open-tactical";
    if (centralPawns >= 3 && pawnTension >= 2) return "dynamic-tension";
    if (pieceCounts.wB + pieceCounts.bB >= 3) return "bishop-pair-strategic";
    if (centralPawns <= 1) return "open-attacking";
    if (pawnTension >= 4) return "complex-tactical";
    
    return "strategic-maneuvering";
}

/**
 * Detect attack opportunities - AlphaZero's killer instinct
 */
function detectAttackOpportunity(fen) {
    const pieceCounts = countPieceTypes(fen);
    const myPieces = myColor === 'w' ? 
        { Q: pieceCounts.wQ, R: pieceCounts.wR, B: pieceCounts.wB, N: pieceCounts.wN } :
        { Q: pieceCounts.bQ, R: pieceCounts.bR, B: pieceCounts.bB, N: pieceCounts.bN };
    
    // Attack potential score
    let attackScore = 0;
    attackScore += myPieces.Q * 40;
    attackScore += myPieces.R * 20;
    attackScore += myPieces.B * 15;
    attackScore += myPieces.N * 12;
    
    if (attackScore >= 70) return "full-attack";
    if (attackScore >= 50) return "piece-pressure";
    return "positional-squeeze";
}

/**
 * AlphaZero Thinking Time - Calculated brilliance
 * Maintains FULL STRENGTH regardless of time - never panics
 */
function getThinkTime(phase, posType, timeLeft) {
    // AlphaZero maintains consistent precision - no panic modifiers
    let baseTime = CONFIG.thinkingTimeMin;
    
    // Phase-based timing (AlphaZero adapts strategically, not from panic)
    if (phase === "opening") {
        baseTime = 150; // Fast opening theory
    } else if (phase === "pure-endgame" || phase === "rook-endgame") {
        baseTime = 200; // Precise endgame calculation
    } else if (posType === "tactical-critical" || posType === "complex-tactical") {
        baseTime = 250; // Deep tactical calculation
    } else {
        baseTime = 180; // Standard precision
    }
    
    // Small variance for natural rhythm (not randomness from weakness)
    const variance = Math.random() * 100;
    
    return Math.floor(Math.max(120, Math.min(baseTime + variance, CONFIG.thinkingTimeMax)));
}

/**
 * AlphaZero Depth Selection - Superior calculation
 * Deep search for flawless play
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    // Phase-specific depth optimization
    if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "pure-endgame" || phase === "minor-piece-endgame" || phase === "rook-endgame") {
        depth = CONFIG.endgameDepth; // AlphaZero's perfect endgame technique
    } else if (phase === "early-middlegame" || phase === "middlegame") {
        if (posType === "tactical-critical" || posType === "complex-tactical" || posType === "open-tactical") {
            depth = CONFIG.tacticalDepth; // Deep tactical calculation
        } else if (posType === "strategic-maneuvering" || posType === "bishop-pair-strategic") {
            depth = CONFIG.positionalDepth; // Strategic depth
        } else {
            depth = CONFIG.baseDepth;
        }
    } else if (phase === "late-middlegame") {
        depth = CONFIG.positionalDepth;
    } else if (phase === "endgame") {
        depth = CONFIG.endgameDepth;
    }
    
    // AlphaZero NEVER reduces depth due to time pressure
    // Maintains full calculation power always
    
    return depth;
}

/**
 * AlphaZero Opening Book - Weighted aggressive selections
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
 * AlphaZero Move Selection - ALWAYS plays the best move
 * No mistakes, no second-guessing, pure precision
 */
function selectBestMove(bestMove, alternatives) {
    // AlphaZero ALWAYS plays the objectively best move
    // No human variance, no mistakes - infallible
    return bestMove;
}

/**
 * Fast multi-PV parsing for move analysis
 */
function parseMultiPV(output) {
    const lines = output.split('\n');
    const pvLines = [];
    
    for (let line of lines) {
        if (line.indexOf('multipv') !== -1) {
            const pvMatch = line.match(/pv\s+(\w+)/);
            const scoreMatch = line.match(/score\s+cp\s+(-?\d+)/);
            const mateMatch = line.match(/score\s+mate\s+(-?\d+)/);
            
            if (pvMatch) {
                let score = 0;
                if (mateMatch) {
                    // Mate scores - prioritize forced checkmates
                    const mateIn = parseInt(mateMatch[1]);
                    score = mateIn > 0 ? 100000 - mateIn : -100000 - mateIn;
                } else if (scoreMatch) {
                    score = parseInt(scoreMatch[1]);
                }
                
                pvLines.push({
                    move: pvMatch[1],
                    score: score
                });
            }
        }
    }
    
    return pvLines.sort((a, b) => b.score - a.score);
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION - AlphaZero Mastery Settings
// Maximum strength, aggressive style, superior evaluation
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    
    // AlphaZero-style aggressive settings
    chessEngine.postMessage("setoption name MultiPV value 3");        // Analyze top 3 lines
    chessEngine.postMessage("setoption name Contempt value 50");      // Aggressive - play for win
    chessEngine.postMessage("setoption name Move Overhead value 30"); // Fast response
    chessEngine.postMessage("setoption name Ponder value false");     // No pondering, pure calculation
    
    chessEngine.postMessage("isready");
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION - AlphaZero Game Control
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
                    strategicContext = detectAttackOpportunity(currentFen);
                    
                    calculateMove();
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO MOVE CALCULATION
// Deep strategic calculation, flawless execution
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book - AlphaZero's prepared aggressive lines
    if (gamePhase === "opening" || gamePhase === "early-middlegame") {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            // Confident, fast opening play
            const thinkTime = Math.random() * 150 + 100;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // AlphaZero deep calculation - full strength always
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
 * Send move - AlphaZero precision execution
 */
function sendMove(move) {
    webSocketWrapper.send(JSON.stringify({
        t: "move",
        d: { 
            u: move, 
            b: 1,
            l: Math.floor(Math.random() * 20) + 15,
            a: 1
        }
    }));
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER - AlphaZero Precision
// Always plays the objectively best move - no mistakes
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
            
            // AlphaZero ALWAYS plays the best move - infallible precision
            let finalMove = selectBestMove(bestMove, multiPVLines);
            
            sendMove(finalMove);
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO MASTERY INITIALIZATION
// Direct initialization - stable and reliable
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();
