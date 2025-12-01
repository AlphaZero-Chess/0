// ==UserScript==
// @name         Lichess Bot - AlphaZero Mastery Edition
// @description  True AlphaZero-level mastery: aggressive, strategic, flawless, superhuman
// @author       AlphaZero - God-like Edition
// @version      4.0.0-ALPHAZERO-MASTERY
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO MASTERY CONFIGURATION
// Superhuman: No mistakes, no panic, pure calculated brilliance
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // AlphaZero NEVER panics - maintains full strength always
    panicThreshold: 0,
    criticalThreshold: 0,
    
    // AlphaZero plays with machine precision - zero mistakes
    humanMistakeRate: 0,
    
    // Maximum calculation depth for superhuman play
    baseDepth: 18,
    tacticalDepth: 22,
    positionalDepth: 20,
    endgameDepth: 24,
    openingDepth: 16,
    
    // Thinking time - efficient but thorough
    thinkingTimeMin: 100,
    thinkingTimeMax: 800,
    
    // Speed multipliers - AlphaZero is consistent
    openingSpeed: 0.6,
    earlyMidSpeed: 0.8,
    middlegameSpeed: 1.0,
    lateMidSpeed: 0.9,
    endgameSpeed: 0.85,
    criticalSpeed: 1.0,
    
    // AlphaZero strategic parameters
    aggressionFactor: 1.0,
    contemptValue: 50,
    
    // Multi-PV for strategic depth
    multiPVCount: 3
};

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO OPENING REPERTOIRE - Comprehensive ECO Coverage
// Aggressive, unconventional, strategic depth across all openings
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // ═══════════════════════════════════════════════════════════════════
    // STARTING POSITION - AlphaZero's Aggressive Choices
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.55 },  // King's Pawn - aggressive
            { move: "d2d4", weight: 0.30 },  // Queen's Pawn - strategic
            { move: "c2c4", weight: 0.10 },  // English - positional
            { move: "g1f3", weight: 0.05 }   // Reti - hypermodern
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // B00-B09: UNCOMMON KING'S PAWN DEFENSES
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.40 },  // Sicilian - dynamic
            { move: "e7e5", weight: 0.30 },  // Open Game
            { move: "e7e6", weight: 0.15 },  // French - solid
            { move: "c7c6", weight: 0.10 },  // Caro-Kann - strategic
            { move: "d7d6", weight: 0.05 }   // Pirc - hypermodern
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // B20-B99: SICILIAN DEFENSE VARIATIONS
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.50 },  // Open Sicilian
            { move: "b1c3", weight: 0.25 },  // Closed Sicilian
            { move: "c2c3", weight: 0.15 },  // Alapin
            { move: "f2f4", weight: 0.10 }   // Grand Prix Attack
        ]
    },
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d6", weight: 0.40 },  // Classical/Najdorf setup
            { move: "b8c6", weight: 0.30 },  // Classical
            { move: "e7e6", weight: 0.20 },  // Scheveningen/Kan
            { move: "g7g6", weight: 0.10 }   // Dragon
        ]
    },
    // Sicilian Najdorf
    "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.60 },  // Najdorf
            { move: "e7e5", weight: 0.25 },  // Sveshnikov
            { move: "e7e6", weight: 0.15 }   // Scheveningen
        ]
    },
    // Sicilian Dragon
    "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
        white: [
            { move: "f2f3", weight: 0.50 },  // Yugoslav Attack - aggressive
            { move: "c1e3", weight: 0.30 },  // Classical
            { move: "f1e2", weight: 0.20 }   // Quiet
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // C00-C19: FRENCH DEFENSE
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.70 },  // Main line
            { move: "d2d3", weight: 0.15 },  // King's Indian Attack
            { move: "b1c3", weight: 0.15 }   // Two Knights
        ]
    },
    "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "d7d5", weight: 0.80 },  // Main French
            { move: "c7c5", weight: 0.20 }   // Franco-Sicilian
        ]
    },
    // French Winawer
    "rnbqk1nr/ppp2ppp/4p3/3p4/1b1PP3/2N5/PPP2PPP/R1BQKBNR w KQkq -": {
        white: [
            { move: "e4e5", weight: 0.70 },  // Advance - AlphaZero favorite
            { move: "e4d5", weight: 0.30 }   // Exchange
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // C20-C99: OPEN GAMES (e4 e5)
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6": {
        white: [
            { move: "g1f3", weight: 0.70 },  // King's Knight
            { move: "f1c4", weight: 0.15 },  // Bishop's Opening
            { move: "f2f4", weight: 0.10 },  // King's Gambit - aggressive
            { move: "b1c3", weight: 0.05 }   // Vienna
        ]
    },
    // Italian Game
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f1c4", weight: 0.50 },  // Italian
            { move: "f1b5", weight: 0.35 },  // Ruy Lopez
            { move: "d2d4", weight: 0.10 },  // Scotch
            { move: "b1c3", weight: 0.05 }   // Four Knights
        ]
    },
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.45 },  // Two Knights Defense
            { move: "f8c5", weight: 0.40 },  // Giuoco Piano
            { move: "f8e7", weight: 0.15 }   // Hungarian Defense
        ]
    },
    // Ruy Lopez
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.60 },  // Morphy Defense
            { move: "g8f6", weight: 0.25 },  // Berlin Defense
            { move: "f8c5", weight: 0.15 }   // Classical
        ]
    },
    // Ruy Lopez Morphy Defense
    "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "b5a4", weight: 0.70 },  // Main line
            { move: "b5c6", weight: 0.30 }   // Exchange variation
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // D00-D69: QUEEN'S PAWN GAMES
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.40 },  // Indian systems
            { move: "d7d5", weight: 0.35 },  // Classical
            { move: "e7e6", weight: 0.15 },  // Queen's Pawn Game
            { move: "f7f5", weight: 0.10 }   // Dutch Defense
        ]
    },
    // Queen's Gambit
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.45 },  // QGD
            { move: "c7c6", weight: 0.30 },  // Slav
            { move: "d5c4", weight: 0.15 },  // QGA
            { move: "g8f6", weight: 0.10 }   // QGD main
        ]
    },
    // Queen's Gambit Declined
    "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Main line
            { move: "g1f3", weight: 0.30 },  // Exchange variation setup
            { move: "c4d5", weight: 0.20 }   // Exchange
        ]
    },
    // Slav Defense
    "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "g1f3", weight: 0.50 },  // Main line
            { move: "b1c3", weight: 0.30 },  // Semi-Slav
            { move: "c4d5", weight: 0.20 }   // Exchange
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // E00-E99: INDIAN DEFENSES
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "c2c4", weight: 0.60 },  // Main Indian
            { move: "g1f3", weight: 0.25 },  // London System
            { move: "c1f4", weight: 0.15 }   // London System
        ]
    },
    // Nimzo-Indian
    "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
        white: [
            { move: "e2e3", weight: 0.40 },  // Rubinstein
            { move: "d1c2", weight: 0.35 },  // Classical
            { move: "c1g5", weight: 0.25 }   // Leningrad
        ]
    },
    // King's Indian Defense
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Classical
            { move: "g1f3", weight: 0.30 },  // Fianchetto
            { move: "e2e4", weight: 0.20 }   // Four Pawns Attack
        ]
    },
    // King's Indian Classical
    "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R b KQ -": {
        black: [
            { move: "e7e5", weight: 0.60 },  // Classical break
            { move: "c7c5", weight: 0.25 },  // Benoni-like
            { move: "b8d7", weight: 0.15 }   // Quiet
        ]
    },
    // Grunfeld Defense
    "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6": {
        white: [
            { move: "c4d5", weight: 0.45 },  // Exchange
            { move: "g1f3", weight: 0.35 },  // Classical
            { move: "c1f4", weight: 0.20 }   // Russian System
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // A00-A39: FLANK OPENINGS
    // ═══════════════════════════════════════════════════════════════════
    // English Opening
    "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e5", weight: 0.35 },  // Reversed Sicilian
            { move: "c7c5", weight: 0.30 },  // Symmetrical
            { move: "g8f6", weight: 0.25 },  // Indian
            { move: "e7e6", weight: 0.10 }   // Agincourt
        ]
    },
    // Reti Opening
    "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.45 },  // Central
            { move: "g8f6", weight: 0.30 },  // Symmetrical
            { move: "c7c5", weight: 0.25 }   // Sicilian Reversed
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // B10-B19: CARO-KANN DEFENSE
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.60 },  // Main line
            { move: "b1c3", weight: 0.25 },  // Two Knights
            { move: "g1f3", weight: 0.15 }   // Two Knights
        ]
    },
    "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "d7d5", weight: 0.90 },  // Main Caro-Kann
            { move: "g7g6", weight: 0.10 }   // Modern
        ]
    },
    // Caro-Kann Advance
    "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "c8f5", weight: 0.50 },  // Short variation
            { move: "e7e6", weight: 0.30 },  // Botvinnik-Carls
            { move: "c6c5", weight: 0.20 }   // Arkell/Karpov
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // A40-A79: MODERN & PIRC DEFENSE
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.60 },  // Main
            { move: "g1f3", weight: 0.25 },  // Quiet
            { move: "b1c3", weight: 0.15 }   // Austrian Attack prep
        ]
    },
    // Pirc Austrian Attack
    "rnbqkb1r/ppp1pp1p/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq f3": {
        black: [
            { move: "f8g7", weight: 0.70 },  // Fianchetto
            { move: "c7c5", weight: 0.30 }   // Counter
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // KING'S GAMBIT - AlphaZero Aggressive
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3": {
        black: [
            { move: "e5f4", weight: 0.60 },  // Accepted - tactical
            { move: "d7d5", weight: 0.25 },  // Falkbeer Counter
            { move: "f8c5", weight: 0.15 }   // Declined
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // LONDON SYSTEM
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkb1r/pppppppp/5n2/8/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.40 },  // Classical
            { move: "e7e6", weight: 0.30 },  // Semi-Slav setup
            { move: "g7g6", weight: 0.30 }   // King's Indian
        ]
    },
    "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq -": {
        black: [
            { move: "c7c5", weight: 0.40 },  // Challenge center
            { move: "e7e6", weight: 0.35 },  // Solid
            { move: "c8f5", weight: 0.25 }   // Mirror
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // CATALAN OPENING
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.60 },  // Closed Catalan
            { move: "f8b4", weight: 0.25 },  // Bogo-Indian hybrid
            { move: "c7c5", weight: 0.15 }   // Benoni
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // DUTCH DEFENSE
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq f6": {
        white: [
            { move: "g2g3", weight: 0.45 },  // Leningrad Dutch
            { move: "c2c4", weight: 0.35 },  // Classical
            { move: "g1f3", weight: 0.20 }   // Quiet
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // BENONI DEFENSE
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkb1r/pp1ppppp/5n2/2pP4/8/8/PPP1PPPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "e7e6", weight: 0.50 },  // Modern Benoni
            { move: "d7d6", weight: 0.30 },  // Old Benoni
            { move: "g7g6", weight: 0.20 }   // Fianchetto
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // SCANDINAVIAN DEFENSE
    // ═══════════════════════════════════════════════════════════════════
    "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6": {
        white: [
            { move: "e4d5", weight: 0.80 },  // Main - capture
            { move: "b1c3", weight: 0.20 }   // Quiet
        ]
    },
    "rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.60 },  // Attack queen
            { move: "g1f3", weight: 0.40 }   // Development
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
let lastEvaluation = 0;
let strategicPriority = "balanced";

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO STRATEGIC HELPERS
// Superhuman: Perfect evaluation, no errors, calculated brilliance
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
 * Enhanced material counting for strategic decisions
 */
function countMaterial(fen) {
    const board = fen.split(' ')[0];
    let white = 0, black = 0;
    const values = { 'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'K': 0 };
    
    for (let i = 0; i < board.length; i++) {
        const char = board[i];
        const upper = char.toUpperCase();
        if (values[upper] !== undefined) {
            if (char === upper) white += values[upper];
            else black += values[upper];
        }
    }
    return { white, black, diff: white - black };
}

/**
 * AlphaZero game phase detection (strategic depth)
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    const material = countMaterial(fen);
    const totalMaterial = material.white + material.black;
    
    // AlphaZero-style phase detection with strategic awareness
    if (moveNum <= 8) return "opening";
    if (moveNum <= 14 && pieces > 28) return "early-middlegame";
    if (pieces > 22 || totalMaterial > 50) return "middlegame";
    if (pieces > 14 || totalMaterial > 30) return "late-middlegame";
    if (pieces > 8 || totalMaterial > 15) return "early-endgame";
    return "endgame";
}

/**
 * AlphaZero position type detection (strategic classification)
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    
    // Check indicators
    if (fen.indexOf("+") !== -1) return "tactical-critical";
    
    // Pawn structure analysis
    let whitePawns = 0, blackPawns = 0;
    let centralPawns = 0;
    
    const rows = board.split('/');
    for (let r = 0; r < rows.length; r++) {
        let col = 0;
        for (let c = 0; c < rows[r].length; c++) {
            const char = rows[r][c];
            if (char >= '1' && char <= '8') {
                col += parseInt(char);
            } else {
                if (char === 'P') {
                    whitePawns++;
                    if (col >= 2 && col <= 5) centralPawns++;
                } else if (char === 'p') {
                    blackPawns++;
                    if (col >= 2 && col <= 5) centralPawns++;
                }
                col++;
            }
        }
    }
    
    // Strategic classification
    if (centralPawns >= 4) return "closed-strategic";
    if (whitePawns + blackPawns <= 8) return "open-tactical";
    if (whitePawns !== blackPawns) return "imbalanced";
    
    return "dynamic";
}

/**
 * AlphaZero strategic priority detection
 */
function getStrategicPriority(fen, phase, posType) {
    const material = countMaterial(fen);
    
    // AlphaZero-style strategic priorities
    if (phase === "endgame" || phase === "early-endgame") {
        if (Math.abs(material.diff) >= 2) return "conversion";
        return "precision";
    }
    
    if (posType === "tactical-critical" || posType === "open-tactical") {
        return "tactical-domination";
    }
    
    if (posType === "closed-strategic") {
        return "pawn-storm";
    }
    
    if (phase === "middlegame" && posType === "imbalanced") {
        return "initiative";
    }
    
    return "aggressive-control";
}

/**
 * AlphaZero thinking time - efficient precision, no hesitation
 */
function getThinkTime(phase, posType, timeLeft) {
    // AlphaZero maintains consistent strength - no panic
    let baseTime = CONFIG.thinkingTimeMin;
    let maxTime = CONFIG.thinkingTimeMax;
    
    // Phase-based efficiency
    let speedMultiplier = CONFIG.middlegameSpeed;
    if (phase === "opening") speedMultiplier = CONFIG.openingSpeed;
    else if (phase === "early-middlegame") speedMultiplier = CONFIG.earlyMidSpeed;
    else if (phase === "late-middlegame") speedMultiplier = CONFIG.lateMidSpeed;
    else if (phase === "endgame" || phase === "early-endgame") speedMultiplier = CONFIG.endgameSpeed;
    
    // Position complexity (not panic - strategic allocation)
    if (posType === "tactical-critical" || posType === "open-tactical") {
        speedMultiplier *= CONFIG.criticalSpeed;
    }
    
    // Time management - AlphaZero is efficient, not panicked
    if (timeLeft < 10000) maxTime = Math.min(maxTime, 400);
    if (timeLeft < 5000) maxTime = Math.min(maxTime, 250);
    if (timeLeft < 3000) maxTime = Math.min(maxTime, 150);
    
    const variance = (maxTime - baseTime) * speedMultiplier;
    const thinkTime = baseTime + (Math.random() * variance * 0.5);
    
    return Math.floor(Math.max(80, Math.min(thinkTime, maxTime)));
}

/**
 * AlphaZero adaptive depth - maximum calculation power
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    // Phase-based depth (AlphaZero calculates deeply always)
    if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "endgame" || phase === "early-endgame") {
        depth = CONFIG.endgameDepth; // Maximum depth for flawless endgame
    } else if (phase === "middlegame" || phase === "late-middlegame") {
        if (posType === "tactical-critical" || posType === "open-tactical") {
            depth = CONFIG.tacticalDepth;
        } else {
            depth = CONFIG.positionalDepth;
        }
    } else if (phase === "early-middlegame") {
        depth = CONFIG.positionalDepth;
    }
    
    // Time-based adjustment (efficiency, not weakness)
    if (timeLeft < 8000) depth = Math.max(14, depth);
    if (timeLeft < 4000) depth = Math.max(12, depth);
    if (timeLeft < 2000) depth = Math.max(10, depth);
    
    return depth;
}

/**
 * Weighted opening book selection (AlphaZero variety with purpose)
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
 * AlphaZero move selection - ALWAYS optimal (zero mistakes)
 */
function selectBestMove(bestMove, alternatives) {
    // AlphaZero NEVER makes mistakes - always plays the best move
    // No variance, no second-best moves, pure calculated brilliance
    return bestMove;
}

/**
 * Fast multi-PV parsing for strategic depth
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
                    score = parseInt(mateMatch[1]) > 0 ? 10000 : -10000;
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
// Direct initialization for stability (no try-catch wrapping)
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    chessEngine.postMessage("setoption name MultiPV value " + CONFIG.multiPVCount);
    chessEngine.postMessage("setoption name Contempt value " + CONFIG.contemptValue);
    chessEngine.postMessage("setoption name Move Overhead value 30");
    chessEngine.postMessage("isready");
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION - AlphaZero Style
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
                    strategicPriority = getStrategicPriority(currentFen, gamePhase, positionType);
                    
                    calculateMove();
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO MOVE CALCULATION - Pure Calculated Brilliance
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book with AlphaZero-style variety
    if (gamePhase === "opening" || gamePhase === "early-middlegame") {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            // AlphaZero plays book moves with efficient timing
            const thinkTime = Math.random() * 200 + 150;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // AlphaZero engine calculation - maximum strength
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    const thinkTime = getThinkTime(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
    chessEngine.postMessage("position fen " + currentFen);
    chessEngine.postMessage("go depth " + depth);
    
    setTimeout(() => {
        // Handled by engine message callback
    }, thinkTime);
}

/**
 * Send move - AlphaZero precision
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
// ALPHAZERO ENGINE MESSAGE HANDLER - Infallible Execution
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    
    chessEngine.onmessage = function (event) {
        engineOutput += event + "\n";
        
        // Parse multi-PV lines for strategic depth
        if (event.indexOf('multipv') !== -1) {
            const lines = parseMultiPV(event);
            if (lines.length > 0) {
                multiPVLines = lines;
            }
        }
        
        // Parse evaluation for strategic awareness
        if (event.indexOf('score cp') !== -1) {
            const scoreMatch = event.match(/score\s+cp\s+(-?\d+)/);
            if (scoreMatch) {
                lastEvaluation = parseInt(scoreMatch[1]);
            }
        }
        
        if (event && event.indexOf('bestmove') !== -1) {
            const moveParts = event.split(" ");
            bestMove = moveParts[1];
            
            // AlphaZero ALWAYS plays the best move - no variance, no mistakes
            let finalMove = selectBestMove(bestMove, multiPVLines);
            
            sendMove(finalMove);
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO INITIALIZATION - Direct, Stable, Powerful
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();
