// ==UserScript==
// @name         Lichess Bot - AlphaZero Style (God-Tier Edition)
// @description  True AlphaZero-level mastery: aggressive, sacrificial, strategic dominance
// @author       AlphaZero - God-Tier Edition
// @version      4.0.0-ALPHAZERO-GODLIKE
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION - AlphaZero God-Tier: No Mistakes, No Mercy
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // AlphaZero NEVER makes mistakes - perfect play always
    humanMistakeRate: 0,
    
    // Timing - swift and decisive like AlphaZero
    thinkingTimeMin: 100,
    thinkingTimeMax: 800,
    
    // Depth - AlphaZero sees deeper
    baseDepth: 14,
    tacticalDepth: 16,
    positionalDepth: 15,
    endgameDepth: 18,
    openingDepth: 12,
    
    // Speed multipliers - consistent superhuman speed
    openingSpeed: 0.5,
    earlyMidSpeed: 0.7,
    middlegameSpeed: 0.8,
    lateMidSpeed: 0.75,
    endgameSpeed: 0.7,
    criticalSpeed: 0.9,
    
    // AlphaZero NEVER panics - maintains full strength always
    panicThreshold: 0,
    criticalThreshold: 0,
    
    // AlphaZero Style Preferences
    aggressionBonus: 35,
    sacrificeBonus: 25,
    pawnStormBonus: 20,
    initiativeBonus: 30,
    kingAttackBonus: 40,
    prophylaxisBonus: 15,
    spaceAdvantageBonus: 18,
    
    // Contempt - AlphaZero plays for the win
    contemptValue: 50
};

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO OPENING BOOK - Comprehensive ECO Codes, Aggressive Repertoire
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // === STARTING POSITION ===
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.55 },  // King's Pawn - aggressive
            { move: "d2d4", weight: 0.30 },  // Queen's Pawn - strategic
            { move: "c2c4", weight: 0.10 },  // English - flexible
            { move: "g1f3", weight: 0.05 }   // Reti - hypermodern
        ]
    },
    
    // === OPEN GAMES (E4 E5) ===
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "e7e5", weight: 0.45 },  // Open Game
            { move: "c7c5", weight: 0.35 },  // Sicilian - aggressive
            { move: "e7e6", weight: 0.10 },  // French
            { move: "c7c6", weight: 0.10 }   // Caro-Kann
        ]
    },
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6": {
        white: [
            { move: "g1f3", weight: 0.50 },  // King's Knight
            { move: "f2f4", weight: 0.25 },  // King's Gambit - ultra-aggressive
            { move: "b1c3", weight: 0.15 },  // Vienna
            { move: "f1c4", weight: 0.10 }   // Bishop's Opening
        ]
    },
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "b8c6", weight: 0.60 },  // Classical
            { move: "g8f6", weight: 0.30 },  // Petrov
            { move: "d7d6", weight: 0.10 }   // Philidor
        ]
    },
    
    // === RUY LOPEZ ===
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f1b5", weight: 0.60 },  // Ruy Lopez
            { move: "f1c4", weight: 0.25 },  // Italian Game
            { move: "d2d4", weight: 0.15 }   // Scotch - aggressive
        ]
    },
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.50 },  // Morphy Defense
            { move: "g8f6", weight: 0.30 },  // Berlin Defense
            { move: "f8c5", weight: 0.15 },  // Classical
            { move: "d7d6", weight: 0.05 }   // Steinitz
        ]
    },
    "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "b5a4", weight: 0.70 },  // Main line
            { move: "b5c6", weight: 0.30 }   // Exchange variation
        ]
    },
    
    // === ITALIAN GAME ===
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "f8c5", weight: 0.45 },  // Giuoco Piano
            { move: "g8f6", weight: 0.45 },  // Two Knights
            { move: "f8e7", weight: 0.10 }   // Hungarian
        ]
    },
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "c2c3", weight: 0.50 },  // Main line
            { move: "b2b4", weight: 0.30 },  // Evans Gambit - aggressive
            { move: "d2d3", weight: 0.20 }   // Giuoco Pianissimo
        ]
    },
    
    // === SICILIAN DEFENSE ===
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.55 },  // Open Sicilian
            { move: "b1c3", weight: 0.20 },  // Closed Sicilian
            { move: "c2c3", weight: 0.15 },  // Alapin
            { move: "f2f4", weight: 0.10 }   // Grand Prix Attack
        ]
    },
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d6", weight: 0.40 },  // Najdorf/Dragon prep
            { move: "b8c6", weight: 0.30 },  // Classical
            { move: "e7e6", weight: 0.20 },  // Scheveningen/Paulsen
            { move: "g8f6", weight: 0.10 }   // Nimzowitsch
        ]
    },
    "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.90 },  // Open Sicilian main
            { move: "f1b5", weight: 0.10 }   // Moscow variation
        ]
    },
    "rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f3d4", weight: 0.95 },  // Recapture
            { move: "d1d4", weight: 0.05 }
        ]
    },
    "rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.50 },  // Najdorf/Dragon prep
            { move: "b8c6", weight: 0.35 },  // Classical
            { move: "e7e6", weight: 0.15 }   // Scheveningen
        ]
    },
    
    // === NAJDORF SICILIAN ===
    "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.95 },
            { move: "f2f3", weight: 0.05 }
        ]
    },
    "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.50 },  // Najdorf
            { move: "e7e6", weight: 0.25 },  // Scheveningen
            { move: "g7g6", weight: 0.25 }   // Dragon
        ]
    },
    
    // === DRAGON SICILIAN ===
    "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
        white: [
            { move: "f1e2", weight: 0.40 },  // Classical Dragon
            { move: "c1e3", weight: 0.35 },  // Yugoslav Attack
            { move: "f2f3", weight: 0.25 }   // Yugoslav prep
        ]
    },
    
    // === FRENCH DEFENSE ===
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.80 },  // Main line
            { move: "b1c3", weight: 0.15 },  // Vienna-style
            { move: "d2d3", weight: 0.05 }   // King's Indian Attack
        ]
    },
    "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "d7d5", weight: 0.85 },  // Main French
            { move: "c7c5", weight: 0.15 }   // Franco-Sicilian
        ]
    },
    "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6": {
        white: [
            { move: "b1c3", weight: 0.40 },  // Main line
            { move: "e4e5", weight: 0.35 },  // Advance variation
            { move: "e4d5", weight: 0.15 },  // Exchange
            { move: "b1d2", weight: 0.10 }   // Tarrasch
        ]
    },
    
    // === CARO-KANN DEFENSE ===
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.70 },  // Main line
            { move: "b1c3", weight: 0.20 },  // Two Knights
            { move: "d2d3", weight: 0.10 }   // King's Indian Attack
        ]
    },
    "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "d7d5", weight: 0.95 },
            { move: "g7g6", weight: 0.05 }
        ]
    },
    "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6": {
        white: [
            { move: "b1c3", weight: 0.45 },  // Classical
            { move: "e4e5", weight: 0.25 },  // Advance
            { move: "e4d5", weight: 0.20 },  // Exchange
            { move: "b1d2", weight: 0.10 }   // Modern
        ]
    },
    
    // === QUEEN'S PAWN OPENINGS ===
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.40 },  // Indian Defenses
            { move: "d7d5", weight: 0.35 },  // Queen's Gambit
            { move: "e7e6", weight: 0.15 },  // Queen's Gambit prep
            { move: "f7f5", weight: 0.10 }   // Dutch - aggressive
        ]
    },
    
    // === QUEEN'S GAMBIT ===
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.40 },  // QGD
            { move: "c7c6", weight: 0.30 },  // Slav
            { move: "d5c4", weight: 0.20 },  // QGA
            { move: "g8f6", weight: 0.10 }   // Flexible
        ]
    },
    "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Main line
            { move: "g1f3", weight: 0.35 },  // Main line
            { move: "c4d5", weight: 0.15 }   // Exchange
        ]
    },
    
    // === SLAV DEFENSE ===
    "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "g1f3", weight: 0.50 },
            { move: "b1c3", weight: 0.35 },
            { move: "c4d5", weight: 0.15 }
        ]
    },
    
    // === INDIAN DEFENSES ===
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.50 },  // Indian prep
            { move: "d7d5", weight: 0.35 },  // Classical
            { move: "f7f5", weight: 0.15 }   // Dutch
        ]
    },
    "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "c2c4", weight: 0.75 },  // Main line
            { move: "g1f3", weight: 0.15 },
            { move: "c1g5", weight: 0.10 }   // Trompowsky
        ]
    },
    "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.35 },  // Nimzo/QID prep
            { move: "g7g6", weight: 0.35 },  // King's Indian/Grunfeld
            { move: "c7c5", weight: 0.20 },  // Benoni
            { move: "e7e5", weight: 0.10 }   // Budapest Gambit
        ]
    },
    
    // === NIMZO-INDIAN ===
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.70 },  // Nimzo-Indian
            { move: "g1f3", weight: 0.30 }   // Queen's Indian
        ]
    },
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq -": {
        black: [
            { move: "f8b4", weight: 0.60 },  // Nimzo-Indian
            { move: "d7d5", weight: 0.30 },  // QGD
            { move: "c7c5", weight: 0.10 }   // Benoni
        ]
    },
    
    // === KING'S INDIAN DEFENSE ===
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.80 },  // Main line
            { move: "g1f3", weight: 0.20 }
        ]
    },
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq -": {
        black: [
            { move: "f8g7", weight: 0.85 },  // Fianchetto
            { move: "d7d5", weight: 0.15 }   // Grunfeld
        ]
    },
    "rnbqk2r/ppppppbp/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.50 },  // Classical
            { move: "g1f3", weight: 0.30 },  // Fianchetto
            { move: "e2e3", weight: 0.20 }   // Petrosian
        ]
    },
    
    // === GRUNFELD DEFENSE ===
    "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6": {
        white: [
            { move: "c4d5", weight: 0.50 },  // Exchange
            { move: "g1f3", weight: 0.30 },
            { move: "c1f4", weight: 0.20 }
        ]
    },
    
    // === ENGLISH OPENING ===
    "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e5", weight: 0.35 },  // Reversed Sicilian
            { move: "g8f6", weight: 0.30 },
            { move: "c7c5", weight: 0.25 },  // Symmetrical
            { move: "e7e6", weight: 0.10 }
        ]
    },
    
    // === RETI OPENING ===
    "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.45 },
            { move: "g8f6", weight: 0.35 },
            { move: "c7c5", weight: 0.20 }
        ]
    },
    
    // === LONDON SYSTEM ===
    "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6": {
        white: [
            { move: "c1f4", weight: 0.45 },  // London
            { move: "g1f3", weight: 0.35 },
            { move: "c2c4", weight: 0.20 }   // QG
        ]
    },
    
    // === KING'S GAMBIT ===
    "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3": {
        black: [
            { move: "e5f4", weight: 0.70 },  // Accept
            { move: "f8c5", weight: 0.20 },  // Decline
            { move: "d7d5", weight: 0.10 }   // Falkbeer Counter
        ]
    },
    
    // === SCOTCH GAME ===
    "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
        black: [
            { move: "e5d4", weight: 0.90 },
            { move: "d7d6", weight: 0.10 }
        ]
    },
    "r1bqkbnr/pppp1ppp/2n5/8/3pP3/5N2/PPP2PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f3d4", weight: 0.95 },
            { move: "c2c3", weight: 0.05 }
        ]
    },
    
    // === VIENNA GAME ===
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.50 },
            { move: "b8c6", weight: 0.35 },
            { move: "f8c5", weight: 0.15 }
        ]
    },
    
    // === PIRC/MODERN ===
    "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.70 },
            { move: "g1f3", weight: 0.20 },
            { move: "b1c3", weight: 0.10 }
        ]
    },
    
    // === ALEKHINE'S DEFENSE ===
    "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e4e5", weight: 0.75 },  // Chase the knight
            { move: "b1c3", weight: 0.25 }
        ]
    },
    
    // === SCANDINAVIAN ===
    "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6": {
        white: [
            { move: "e4d5", weight: 0.95 },
            { move: "b1c3", weight: 0.05 }
        ]
    },
    
    // === PETROV DEFENSE ===
    "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f3e5", weight: 0.70 },  // Main line
            { move: "b1c3", weight: 0.20 },
            { move: "d2d4", weight: 0.10 }
        ]
    },
    
    // === DUTCH DEFENSE ===
    "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq f6": {
        white: [
            { move: "g2g3", weight: 0.40 },  // Leningrad
            { move: "c2c4", weight: 0.35 },
            { move: "e2e4", weight: 0.25 }   // Staunton Gambit - aggressive
        ]
    },
    
    // === BENONI ===
    "rnbqkb1r/pp1ppppp/5n2/2p5/2PP4/8/PP2PPPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "d4d5", weight: 0.75 },  // Benoni
            { move: "g1f3", weight: 0.25 }
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE - AlphaZero Tracking
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
let evaluationHistory = [];
let lastEvaluation = 0;

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO STYLE - Strategic Evaluation & Pattern Recognition
// ═══════════════════════════════════════════════════════════════════════

/**
 * AlphaZero Strategic Patterns - Recognizes key positional themes
 */
const ALPHAZERO_PATTERNS = {
    // Pawn storm patterns (kingside/queenside)
    pawnStorm: {
        kingsideWhite: ['g2g4', 'h2h4', 'f2f4', 'g4g5', 'h4h5'],
        kingsideBlack: ['g7g5', 'h7h5', 'f7f5', 'g5g4', 'h5h4'],
        queensideWhite: ['a2a4', 'b2b4', 'c2c4', 'a4a5', 'b4b5'],
        queensideBlack: ['a7a5', 'b7b5', 'c7c5', 'a5a4', 'b5b4']
    },
    
    // King attack patterns
    kingAttack: ['h2h4', 'g2g4', 'h7h5', 'g7g5', 'f2f4', 'f7f5'],
    
    // Central control
    centralControl: ['e2e4', 'd2d4', 'e7e5', 'd7d5', 'c2c4', 'c7c5'],
    
    // Prophylaxis moves
    prophylaxis: ['h2h3', 'a2a3', 'h7h6', 'a7a6', 'b2b3', 'g2g3']
};

/**
 * Evaluate move for AlphaZero-style characteristics
 */
function evaluateAlphaZeroStyle(move, fen, phase) {
    let bonus = 0;
    
    // Pawn storm detection - AlphaZero signature
    if (ALPHAZERO_PATTERNS.pawnStorm.kingsideWhite.includes(move) ||
        ALPHAZERO_PATTERNS.pawnStorm.kingsideBlack.includes(move) ||
        ALPHAZERO_PATTERNS.pawnStorm.queensideWhite.includes(move) ||
        ALPHAZERO_PATTERNS.pawnStorm.queensideBlack.includes(move)) {
        bonus += CONFIG.pawnStormBonus;
    }
    
    // King attack moves
    if (ALPHAZERO_PATTERNS.kingAttack.includes(move)) {
        bonus += CONFIG.kingAttackBonus;
    }
    
    // Central control in opening/middlegame
    if ((phase === "opening" || phase === "early-middlegame") && 
        ALPHAZERO_PATTERNS.centralControl.includes(move)) {
        bonus += CONFIG.initiativeBonus;
    }
    
    // Prophylaxis - deep positional understanding
    if (phase === "middlegame" || phase === "late-middlegame") {
        if (ALPHAZERO_PATTERNS.prophylaxis.includes(move)) {
            bonus += CONFIG.prophylaxisBonus;
        }
    }
    
    // Piece activity - forward moves get bonus
    const fromRank = parseInt(move[1]);
    const toRank = parseInt(move[3]);
    if (myColor === 'w' && toRank > fromRank) {
        bonus += CONFIG.initiativeBonus * 0.3;
    } else if (myColor === 'b' && toRank < fromRank) {
        bonus += CONFIG.initiativeBonus * 0.3;
    }
    
    return bonus;
}

/**
 * Detect if position has sacrifice potential
 */
function detectSacrificePotential(fen, move) {
    // Check if move involves capture on key squares
    const targetSquare = move.substring(2, 4);
    const keySquares = ['e4', 'd4', 'e5', 'd5', 'f7', 'f2', 'h7', 'h2', 'g7', 'g2'];
    
    if (keySquares.includes(targetSquare)) {
        return CONFIG.sacrificeBonus;
    }
    
    // Knight sacrifices on f7/f2 - classic AlphaZero
    if (move.includes('f7') || move.includes('f2')) {
        return CONFIG.sacrificeBonus * 1.5;
    }
    
    return 0;
}

/**
 * Detect aggressive attacking potential
 */
function detectAggressionPotential(move, phase) {
    let aggression = 0;
    
    // Pawn advances in middlegame are aggressive
    const piece = move[0];
    const toFile = move[2];
    const toRank = parseInt(move[3]);
    
    // Pawn pushes toward enemy territory
    if (myColor === 'w' && toRank >= 5) {
        aggression += CONFIG.aggressionBonus * 0.5;
    } else if (myColor === 'b' && toRank <= 4) {
        aggression += CONFIG.aggressionBonus * 0.5;
    }
    
    // Moves toward opponent's king side
    if (toFile === 'f' || toFile === 'g' || toFile === 'h') {
        aggression += CONFIG.kingAttackBonus * 0.3;
    }
    
    return aggression;
}

// ═══════════════════════════════════════════════════════════════════════
// OPTIMIZED ALPHAZERO HELPERS - No Mistakes, Pure Precision
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
 * Count specific piece type
 */
function countPieceType(fen, pieceChar) {
    let count = 0;
    const board = fen.split(' ')[0];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === pieceChar) count++;
    }
    return count;
}

/**
 * Calculate material balance
 */
function getMaterialBalance(fen) {
    const board = fen.split(' ')[0];
    let white = 0, black = 0;
    
    const values = { 'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9, 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9 };
    
    for (let i = 0; i < board.length; i++) {
        const char = board[i];
        if (values[char]) {
            if (char === char.toUpperCase()) white += values[char];
            else black += values[char];
        }
    }
    
    return white - black;
}

/**
 * Game phase detection (5 phases) - AlphaZero precision
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    const queens = countPieceType(fen, 'Q') + countPieceType(fen, 'q');
    
    if (moveNum <= 8) return "opening";
    if (moveNum <= 15 && pieces > 28) return "early-middlegame";
    if (pieces > 20 && queens > 0) return "middlegame";
    if (pieces > 12) return "late-middlegame";
    return "endgame";
}

/**
 * Advanced position type detection - AlphaZero style
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    
    // Check for open files (tactical potential)
    let openFiles = 0;
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    
    // Count pawns per file to detect open positions
    for (let file of files) {
        let pawns = 0;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 'p' || board[i] === 'P') pawns++;
        }
        if (pawns < 12) openFiles++;
    }
    
    // Tactical indicators
    if (board.indexOf('Q') !== -1 || board.indexOf('q') !== -1) {
        if (openFiles > 3) return "tactical";
    }
    
    // Check for piece tension
    const material = getMaterialBalance(fen);
    if (Math.abs(material) > 2) return "tactical";
    
    // Pawn structure analysis
    const whitePawns = countPieceType(fen, 'P');
    const blackPawns = countPieceType(fen, 'p');
    
    if (whitePawns + blackPawns < 10) return "tactical";  // Open position
    if (whitePawns + blackPawns > 14) return "positional"; // Closed position
    
    return "strategic"; // AlphaZero's domain - long-term planning
}

/**
 * AlphaZero thinking time - swift and decisive
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // Phase-based - AlphaZero is consistent
    if (phase === "opening") speedMultiplier = CONFIG.openingSpeed;
    else if (phase === "early-middlegame") speedMultiplier = CONFIG.earlyMidSpeed;
    else if (phase === "middlegame") speedMultiplier = CONFIG.middlegameSpeed;
    else if (phase === "late-middlegame") speedMultiplier = CONFIG.lateMidSpeed;
    else if (phase === "endgame") speedMultiplier = CONFIG.endgameSpeed;
    
    // Position complexity - slightly more time for critical positions
    if (posType === "tactical") {
        speedMultiplier *= CONFIG.criticalSpeed;
    } else if (posType === "strategic") {
        speedMultiplier *= 0.95;
    }
    
    // AlphaZero NEVER panics - consistent time management
    // No panic reductions - always plays at full strength
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance);
    return Math.floor(Math.max(100, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * Adaptive depth - AlphaZero sees deeper
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "endgame") {
        depth = CONFIG.endgameDepth; // AlphaZero's endgame is legendary
    } else if (phase === "middlegame" || phase === "late-middlegame" || phase === "early-middlegame") {
        if (posType === "tactical") {
            depth = CONFIG.tacticalDepth;
        } else if (posType === "positional" || posType === "strategic") {
            depth = CONFIG.positionalDepth;
        }
    }
    
    // AlphaZero maintains depth even under time pressure
    // Only slight adjustments for extreme time pressure
    if (timeLeft < 3000) depth = Math.max(12, depth - 2);
    else if (timeLeft < 5000) depth = Math.max(13, depth - 1);
    
    return depth;
}

/**
 * Weighted opening book - AlphaZero variety with purpose
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
 * AlphaZero move selection - NO mistakes, only calculated brilliance
 */
function selectAlphaZeroMove(bestMove, alternatives, phase) {
    if (!alternatives || alternatives.length < 2) return bestMove;
    
    // AlphaZero NEVER makes mistakes - always selects optimal
    // But considers style bonuses for equal moves
    
    const topMoves = alternatives.slice(0, Math.min(3, alternatives.length));
    let selectedMove = bestMove;
    let maxScore = -Infinity;
    
    for (let moveData of topMoves) {
        let totalScore = moveData.score || 0;
        
        // Only consider moves within 15 centipawns of best
        const scoreDiff = Math.abs((alternatives[0].score || 0) - totalScore);
        if (scoreDiff > 15) continue;
        
        // Add AlphaZero style bonuses
        totalScore += evaluateAlphaZeroStyle(moveData.move, currentFen, phase);
        totalScore += detectSacrificePotential(currentFen, moveData.move);
        totalScore += detectAggressionPotential(moveData.move, phase);
        
        if (totalScore > maxScore) {
            maxScore = totalScore;
            selectedMove = moveData.move;
        }
    }
    
    return selectedMove;
}

/**
 * Fast multi-PV parsing with score extraction
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
                if (scoreMatch) {
                    score = parseInt(scoreMatch[1]);
                } else if (mateMatch) {
                    // Mate scores - very high value
                    score = mateMatch[1] > 0 ? 10000 - parseInt(mateMatch[1]) : -10000 + Math.abs(parseInt(mateMatch[1]));
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
// ENGINE INITIALIZATION - AlphaZero Optimized Settings
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    chessEngine.postMessage("setoption name MultiPV value 3");
    chessEngine.postMessage("setoption name Contempt value " + CONFIG.contemptValue);
    chessEngine.postMessage("setoption name Move Overhead value 30");
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
// MOVE CALCULATION - AlphaZero Precision
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book - AlphaZero plays principled openings
    if (gamePhase === "opening" || gamePhase === "early-middlegame") {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            const thinkTime = Math.random() * 200 + 150;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // Engine calculation - AlphaZero depth and precision
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
 * Send move - AlphaZero swift execution
 */
function sendMove(move) {
    webSocketWrapper.send(JSON.stringify({
        t: "move",
        d: { 
            u: move, 
            b: 1,
            l: Math.floor(Math.random() * 20) + 10,
            a: 1
        }
    }));
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER - AlphaZero Move Selection
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
        
        // Track evaluation for strategic decisions
        if (event.indexOf('score cp') !== -1) {
            const scoreMatch = event.match(/score\s+cp\s+(-?\d+)/);
            if (scoreMatch) {
                lastEvaluation = parseInt(scoreMatch[1]);
                evaluationHistory.push(lastEvaluation);
                if (evaluationHistory.length > 10) {
                    evaluationHistory.shift();
                }
            }
        }
        
        if (event && event.indexOf('bestmove') !== -1) {
            const moveParts = event.split(" ");
            bestMove = moveParts[1];
            
            let finalMove = bestMove;
            
            // AlphaZero move selection - calculated brilliance, NO mistakes
            if (multiPVLines.length > 1) {
                finalMove = selectAlphaZeroMove(bestMove, multiPVLines, gamePhase);
            }
            
            sendMove(finalMove);
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION - AlphaZero God-Tier
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();
