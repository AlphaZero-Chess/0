// ==UserScript==
// @name         Lichess Bot - AlphaZero Ultimate (God-Tier)
// @description  True AlphaZero-esque play: Hyper-aggressive, flawless, superhuman
// @author       AlphaZero - Ultimate Edition
// @version      4.0.0-ALPHAZERO-ULTIMATE
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO CONFIGURATION - Superhuman, Flawless, Relentless
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Timing - Confident, no hesitation
    thinkingTimeMin: 150,
    thinkingTimeMax: 800,
    
    // ZERO mistakes - AlphaZero is infallible
    humanMistakeRate: 0,
    
    // Depth - Superhuman calculation
    baseDepth: 18,
    tacticalDepth: 22,
    positionalDepth: 20,
    endgameDepth: 24,
    openingDepth: 16,
    
    // Speed - Confident and relentless
    openingSpeed: 0.5,
    earlyMidSpeed: 0.6,
    middlegameSpeed: 0.7,
    lateMidSpeed: 0.65,
    endgameSpeed: 0.55,
    criticalSpeed: 0.8,
    
    // AlphaZero NEVER panics - maintains full strength always
    panicThreshold: 0,
    criticalThreshold: 0,
    
    // AlphaZero Style Parameters
    aggressionFactor: 0.85,
    sacrificeThreshold: 150,
    pawnStormBonus: 40,
    initiativeWeight: 1.4,
    prophylaxisDepth: 3,
    grindingPersistence: true
};

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO OPENING BOOK - Aggressive, Sacrificial, Initiative-Based
// Covers major ECO codes with AlphaZero-preferred aggressive lines
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // ═══ STARTING POSITION - AlphaZero prefers e4 for aggression ═══
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.55 },  // Open game - tactical
            { move: "d2d4", weight: 0.30 },  // Queen's pawn - strategic
            { move: "c2c4", weight: 0.10 },  // English - flexible
            { move: "g1f3", weight: 0.05 }   // Reti - hypermodern
        ]
    },
    
    // ═══ BLACK RESPONSES TO 1.e4 - Aggressive counterplay ═══
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.45 },  // Sicilian - fighting chess
            { move: "e7e5", weight: 0.30 },  // Open game
            { move: "e7e6", weight: 0.15 },  // French - counterattack
            { move: "c7c6", weight: 0.10 }   // Caro-Kann - solid
        ]
    },
    
    // ═══ BLACK RESPONSES TO 1.d4 - Dynamic play ═══
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.40 },  // Indian setups
            { move: "d7d5", weight: 0.35 },  // Classical
            { move: "f7f5", weight: 0.15 },  // Dutch - aggressive
            { move: "e7e6", weight: 0.10 }   // French structure
        ]
    },
    
    // ═══ SICILIAN DEFENSE - AlphaZero's favorite battleground ═══
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.50 },  // Open Sicilian
            { move: "b1c3", weight: 0.25 },  // Closed Sicilian
            { move: "c2c3", weight: 0.15 },  // Alapin - d4 pawn storm
            { move: "f2f4", weight: 0.10 }   // Grand Prix Attack - aggressive
        ]
    },
    
    // ═══ OPEN SICILIAN - Attacking setup ═══
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d6", weight: 0.40 },  // Najdorf/Dragon setup
            { move: "b8c6", weight: 0.35 },  // Classical
            { move: "e7e6", weight: 0.25 }   // Scheveningen/Kan
        ]
    },
    
    // ═══ SICILIAN NAJDORF - The ultimate fighting defense ═══
    "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.70 },  // Main line - open the position
            { move: "f1b5", weight: 0.20 },  // Moscow variation
            { move: "b1c3", weight: 0.10 }   // Delayed d4
        ]
    },
    
    // ═══ ITALIAN GAME - Classical aggression ═══
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.45 },  // Two Knights - sharp
            { move: "f8c5", weight: 0.40 },  // Giuoco Piano
            { move: "f8e7", weight: 0.15 }   // Hungarian - solid
        ]
    },
    
    // ═══ TWO KNIGHTS DEFENSE - Tactical chaos ═══
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "g1f3", weight: 0.40 },  // Quiet Italian
            { move: "d2d3", weight: 0.30 },  // Giuoco Pianissimo
            { move: "b2b4", weight: 0.20 },  // Evans Gambit! - sacrificial
            { move: "f3g5", weight: 0.10 }   // Fried Liver attack setup
        ]
    },
    
    // ═══ RUY LOPEZ - Strategic masterpiece ═══
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.50 },  // Morphy Defense - main line
            { move: "g8f6", weight: 0.30 },  // Berlin Defense
            { move: "f8c5", weight: 0.15 },  // Classical Defense
            { move: "d7d6", weight: 0.05 }   // Steinitz Defense
        ]
    },
    
    // ═══ QUEEN'S GAMBIT - Strategic depth ═══
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.40 },  // QGD - classical
            { move: "c7c6", weight: 0.30 },  // Slav - solid
            { move: "d5c4", weight: 0.20 },  // QGA - active
            { move: "g8f6", weight: 0.10 }   // Indian setup
        ]
    },
    
    // ═══ QUEEN'S GAMBIT DECLINED ═══
    "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.45 },  // Main line
            { move: "g1f3", weight: 0.35 },  // Flexible
            { move: "c4d5", weight: 0.20 }   // Exchange - grinding
        ]
    },
    
    // ═══ NIMZO-INDIAN - Pressure and control ═══
    "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
        white: [
            { move: "e2e3", weight: 0.40 },  // Rubinstein - solid
            { move: "d1c2", weight: 0.35 },  // Classical - avoid doubled pawns
            { move: "f1d3", weight: 0.15 },  // Leningrad
            { move: "g1f3", weight: 0.10 }   // Kasparov variation
        ]
    },
    
    // ═══ KING'S INDIAN DEFENSE - Pawn storm territory ═══
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Classical - space advantage
            { move: "g1f3", weight: 0.30 },  // Fianchetto
            { move: "e2e4", weight: 0.20 }   // Four Pawns Attack - aggressive!
        ]
    },
    
    // ═══ KING'S INDIAN CLASSICAL ═══
    "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R b KQkq -": {
        black: [
            { move: "e7e5", weight: 0.60 },  // Main line - fight for center
            { move: "c7c5", weight: 0.25 },  // Benoni structure
            { move: "b8d7", weight: 0.15 }   // Flexible
        ]
    },
    
    // ═══ GRUNFELD DEFENSE - Dynamic counterplay ═══
    "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6": {
        white: [
            { move: "c4d5", weight: 0.45 },  // Exchange - main line
            { move: "g1f3", weight: 0.35 },  // Russian system
            { move: "d1b3", weight: 0.20 }   // Pressure d5
        ]
    },
    
    // ═══ FRENCH DEFENSE - Counterattacking spirit ═══
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },  // Main line
            { move: "d2d3", weight: 0.25 },  // King's Indian Attack
            { move: "b1c3", weight: 0.25 }   // Nc3 systems
        ]
    },
    
    // ═══ FRENCH ADVANCE - Pawn storm preparation ═══
    "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "c7c5", weight: 0.60 },  // Attack the chain!
            { move: "b8c6", weight: 0.25 },  // Development
            { move: "g8e7", weight: 0.15 }   // Flexible knight
        ]
    },
    
    // ═══ CARO-KANN - Solid but active ═══
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },  // Main line
            { move: "b1c3", weight: 0.30 },  // Two Knights
            { move: "c2c4", weight: 0.20 }   // Panov Attack - open lines
        ]
    },
    
    // ═══ LONDON SYSTEM - Solid for White ═══
    "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq -": {
        black: [
            { move: "c7c5", weight: 0.45 },  // Challenge the center
            { move: "e7e6", weight: 0.35 },  // Classical setup
            { move: "c8f5", weight: 0.20 }   // Active bishop
        ]
    },
    
    // ═══ ENGLISH OPENING - Hypermodern flexibility ═══
    "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e5", weight: 0.35 },  // Reversed Sicilian
            { move: "g8f6", weight: 0.30 },  // Indian setup
            { move: "c7c5", weight: 0.25 },  // Symmetrical
            { move: "e7e6", weight: 0.10 }   // Flexible
        ]
    },
    
    // ═══ CATALAN - Grinding positional pressure ═══
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.50 },  // Classical
            { move: "f8b4", weight: 0.30 },  // Bogo-Indian
            { move: "c7c5", weight: 0.20 }   // Benoni structure
        ]
    },
    
    // ═══ DUTCH DEFENSE - Aggressive kingside play ═══
    "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq f6": {
        white: [
            { move: "g2g3", weight: 0.40 },  // Leningrad setup
            { move: "c2c4", weight: 0.35 },  // Classical
            { move: "b1c3", weight: 0.25 }   // Nc3 systems
        ]
    },
    
    // ═══ PIRC DEFENSE - Counterattacking setup ═══
    "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.55 },  // Main line - space
            { move: "b1c3", weight: 0.30 },  // Austrian Attack setup
            { move: "f2f4", weight: 0.15 }   // Aggressive!
        ]
    },
    
    // ═══ SCANDINAVIAN DEFENSE ═══
    "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6": {
        white: [
            { move: "e4d5", weight: 0.70 },  // Accept - main line
            { move: "b1c3", weight: 0.20 },  // Modern
            { move: "e4e5", weight: 0.10 }   // Advance
        ]
    },
    
    // ═══ ALEKHINE DEFENSE - Hypermodern counterplay ═══
    "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e4e5", weight: 0.60 },  // Chase the knight
            { move: "b1c3", weight: 0.25 },  // Modern
            { move: "d2d3", weight: 0.15 }   // Quiet
        ]
    },
    
    // ═══ SCOTCH GAME - Open tactical play ═══
    "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
        black: [
            { move: "e5d4", weight: 0.70 },  // Accept
            { move: "d7d6", weight: 0.20 },  // Solid
            { move: "f8b4", weight: 0.10 }   // Pin
        ]
    },
    
    // ═══ VIENNA GAME - Aggressive White system ═══
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.50 },  // Main line
            { move: "b8c6", weight: 0.30 },  // Max Lange style
            { move: "f8c5", weight: 0.20 }   // Bishop development
        ]
    },
    
    // ═══ KING'S GAMBIT - Ultimate aggression (AlphaZero loves this) ═══
    "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3": {
        black: [
            { move: "e5f4", weight: 0.55 },  // Accept the gambit
            { move: "d7d5", weight: 0.25 },  // Falkbeer Counter
            { move: "f8c5", weight: 0.20 }   // Decline
        ]
    },
    
    // ═══ PETROFF DEFENSE - Solid equality ═══
    "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f3e5", weight: 0.50 },  // Main line
            { move: "b1c3", weight: 0.30 },  // Three Knights
            { move: "d2d4", weight: 0.20 }   // Scotch-Petroff
        ]
    },
    
    // ═══ BENONI DEFENSE - Dynamic pawn structure ═══
    "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Main line
            { move: "g1f3", weight: 0.30 },  // Flexible
            { move: "e2e4", weight: 0.20 }   // Modern Benoni structure
        ]
    },
    
    // ═══ SLAV DEFENSE - Solid structure ═══
    "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "g1f3", weight: 0.40 },  // Main line
            { move: "b1c3", weight: 0.35 },  // Nc3 systems
            { move: "c4d5", weight: 0.25 }   // Exchange - grinding
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE - AlphaZero maintains perfect composure
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
let positionHistory = [];
let tacticalTension = 0;

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO HELPERS - Superhuman, No Mistakes, Pure Calculation
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
 * Count specific piece types for evaluation
 */
function countPieceTypes(fen) {
    const board = fen.split(' ')[0];
    let pieces = { wQ: 0, bQ: 0, wR: 0, bR: 0, wB: 0, bB: 0, wN: 0, bN: 0, wP: 0, bP: 0 };
    
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        if (c === 'Q') pieces.wQ++;
        else if (c === 'q') pieces.bQ++;
        else if (c === 'R') pieces.wR++;
        else if (c === 'r') pieces.bR++;
        else if (c === 'B') pieces.wB++;
        else if (c === 'b') pieces.bB++;
        else if (c === 'N') pieces.wN++;
        else if (c === 'n') pieces.bN++;
        else if (c === 'P') pieces.wP++;
        else if (c === 'p') pieces.bP++;
    }
    return pieces;
}

/**
 * AlphaZero-style game phase detection (precise)
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    const pieceTypes = countPieceTypes(fen);
    
    // Check for endgame conditions
    const totalQueens = pieceTypes.wQ + pieceTypes.bQ;
    const totalRooks = pieceTypes.wR + pieceTypes.bR;
    const totalMinors = pieceTypes.wB + pieceTypes.bB + pieceTypes.wN + pieceTypes.bN;
    
    // Pure pawn endgame
    if (totalQueens === 0 && totalRooks === 0 && totalMinors <= 1) return "endgame";
    
    // Rook endgame
    if (totalQueens === 0 && totalMinors === 0 && pieces <= 10) return "endgame";
    
    // Standard phase detection
    if (moveNum <= 8) return "opening";
    if (moveNum <= 14 && pieces > 28) return "early-middlegame";
    if (pieces > 22) return "middlegame";
    if (pieces > 14) return "late-middlegame";
    return "endgame";
}

/**
 * AlphaZero position analysis - detects tactical/strategic nature
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    const pieces = countPieceTypes(fen);
    
    // Check indicators
    if (fen.indexOf("+") !== -1) return "tactical";
    
    // Piece activity and tension
    let tension = 0;
    
    // Queens on board = higher tactical potential
    tension += (pieces.wQ + pieces.bQ) * 3;
    
    // Open files (simplified detection)
    const ranks = board.split('/');
    let openFiles = 0;
    for (let file = 0; file < 8; file++) {
        let hasPawn = false;
        for (let rank = 0; rank < ranks.length; rank++) {
            let filePos = 0;
            for (let i = 0; i < ranks[rank].length; i++) {
                const c = ranks[rank][i];
                if (c >= '1' && c <= '8') {
                    filePos += parseInt(c);
                } else {
                    if (filePos === file && (c === 'P' || c === 'p')) {
                        hasPawn = true;
                    }
                    filePos++;
                }
            }
        }
        if (!hasPawn) openFiles++;
    }
    tension += openFiles * 2;
    
    // Store for later use
    tacticalTension = tension;
    
    // AlphaZero thresholds
    if (tension > 12) return "tactical";
    if (tension > 8) return "dynamic";
    if (tension < 4) return "positional";
    
    return "normal";
}

/**
 * AlphaZero thinking time - confident, never rushed
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // Phase-based (AlphaZero adjusts depth, not panic)
    if (phase === "opening") speedMultiplier = CONFIG.openingSpeed;
    else if (phase === "early-middlegame") speedMultiplier = CONFIG.earlyMidSpeed;
    else if (phase === "middlegame") speedMultiplier = CONFIG.middlegameSpeed;
    else if (phase === "late-middlegame") speedMultiplier = CONFIG.lateMidSpeed;
    else if (phase === "endgame") speedMultiplier = CONFIG.endgameSpeed;
    
    // Position type - tactical positions get more focus
    if (posType === "tactical") {
        speedMultiplier *= CONFIG.criticalSpeed;
    } else if (posType === "dynamic") {
        speedMultiplier *= 0.9;
    }
    
    // AlphaZero NEVER panics - maintains composure with adjusted speed only
    if (timeLeft < 10000) speedMultiplier *= 0.7;
    if (timeLeft < 5000) speedMultiplier *= 0.6;
    if (timeLeft < 2000) speedMultiplier *= 0.5;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance * 0.3);
    return Math.floor(Math.max(100, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * AlphaZero adaptive depth - ALWAYS maintains superhuman calculation
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "endgame") {
        // AlphaZero's endgame is PERFECT - maximum depth
        depth = CONFIG.endgameDepth;
    } else if (phase === "middlegame" || phase === "late-middlegame" || phase === "early-middlegame") {
        if (posType === "tactical" || posType === "dynamic") {
            depth = CONFIG.tacticalDepth;
        } else if (posType === "positional") {
            depth = CONFIG.positionalDepth;
        }
    }
    
    // AlphaZero maintains strength - only slight adjustment for extreme time
    if (timeLeft < 5000) depth = Math.max(14, depth - 2);
    if (timeLeft < 2000) depth = Math.max(12, depth - 4);
    
    return depth;
}

/**
 * AlphaZero opening book - pure optimal play with style preference
 */
function getBookMove(fen) {
    const fenKey = fen.split(' ').slice(0, 4).join(' ');
    const position = OPENINGS[fenKey];
    
    if (!position) return null;
    
    const moves = myColor === 'w' ? position.white : position.black;
    if (!moves || moves.length === 0) return null;
    
    // AlphaZero prefers aggressive lines (higher weight to first options)
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

/**
 * AlphaZero move selection - ALWAYS plays the best move
 * No human variance, no mistakes - pure optimal play
 */
function selectBestMove(bestMove, alternatives) {
    // AlphaZero ALWAYS plays the objectively best move
    // No variance, no second-best - infallible
    return bestMove;
}

/**
 * Fast multi-PV parsing for evaluation
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
                    score = parseInt(mateMatch[1]) > 0 ? 30000 : -30000;
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
// ENGINE INITIALIZATION - AlphaZero-style aggressive settings
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    
    // AlphaZero-style engine configuration
    chessEngine.postMessage("setoption name MultiPV value 3");           // Analyze top 3 moves
    chessEngine.postMessage("setoption name Contempt value 50");         // Aggressive - play for win
    chessEngine.postMessage("setoption name Move Overhead value 30");    // Fast response
    chessEngine.postMessage("setoption name Ponder value false");        // No pondering needed
    chessEngine.postMessage("setoption name UCI_AnalyseMode value false");
    
    chessEngine.postMessage("isready");
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION - Position tracking
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
                    
                    // Track position history for repetition awareness
                    positionHistory.push(currentFen.split(' ')[0]);
                    if (positionHistory.length > 20) positionHistory.shift();
                    
                    calculateMove();
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// MOVE CALCULATION - AlphaZero precision
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book (AlphaZero aggressive preferences)
    if (gamePhase === "opening" || (gamePhase === "early-middlegame" && moveCount <= 12)) {
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
    
    // AlphaZero engine calculation - full depth always
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
 * Send move - AlphaZero confident execution
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
// ENGINE MESSAGE HANDLER - AlphaZero always plays optimal
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
// INITIALIZATION - Direct and stable
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();
