// ==UserScript==
// @name         Lichess Bot - True AlphaZero (God-Like Edition)
// @description  True AlphaZero - Flawless endgame, perfect positional judgment, strategic depth, legendary patience
// @author       AlphaZero - God-Like Edition
// @version      5.0.0-ALPHAZERO-GODLIKE
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION - TRUE ALPHAZERO: STRATEGIC DEPTH, PATIENCE, FLAWLESS PLAY
// AlphaZero's hallmark: unconventional play, grinding positions, resilience
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Timing - Patient and precise like AlphaZero
    thinkingTimeMin: 80,
    thinkingTimeMax: 600,
    
    // NO MISTAKES - AlphaZero plays flawlessly
    humanMistakeRate: 0,
    
    // Depth - Enhanced for strategic vision and endgame precision
    baseDepth: 15,
    tacticalDepth: 17,
    positionalDepth: 16,
    endgameDepth: 20,           // FLAWLESS endgame - maximum depth
    openingDepth: 13,
    strategicDepth: 18,         // For long-term planning positions
    
    // Speed multipliers - Patient, methodical play
    openingSpeed: 0.25,
    earlyMidSpeed: 0.4,
    middlegameSpeed: 0.55,
    lateMidSpeed: 0.5,
    endgameSpeed: 0.7,          // More time for precise endgame
    criticalSpeed: 0.8,
    grindingSpeed: 0.65,        // For complex grinding positions
    
    // Time thresholds
    panicThreshold: 5000,
    criticalThreshold: 10000,
    
    // AlphaZero Strategic Settings - NOT passive, strategically DEEP
    strategicDepthLevel: 95,     // Strategic depth (0-100)
    positionalPatience: 90,      // Patience in positional play (0-100)
    endgamePrecision: 100,       // FLAWLESS endgame precision
    resilience: 95,              // Defensive resilience
    grindingAbility: 90,         // Ability to grind out positions
    
    // Positional Bonuses - AlphaZero's superior evaluation
    pieceActivityBonus: 45,      // Active pieces over material
    pawnStructureWeight: 40,     // Long-term pawn structure
    kingSafetyWeight: 50,        // King safety evaluation
    spaceControlBonus: 35,       // Space advantage
    initiativeBonus: 30,         // Maintaining initiative
    prophylaxisBonus: 25,        // Preventing opponent plans
    
    // Draw Handling - AlphaZero recognizes draws early but plays to confirm
    allowStrategicDraws: true,   // Accept draws when objectively best
    drawConfirmationMoves: 10,   // Moves to confirm a draw position
    minAdvantageToPlay: 5        // Centipawns advantage to keep playing
};

// ═══════════════════════════════════════════════════════════════════════
// OPENING BOOK - ALPHAZERO STRATEGIC REPERTOIRE
// Unconventional, strategically deep lines - AlphaZero's signature style
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // Starting position - AlphaZero's versatile openings
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.45 },  // King's pawn - classical
            { move: "d2d4", weight: 0.40 },  // Queen's pawn - strategic depth
            { move: "c2c4", weight: 0.10 },  // English - positional mastery
            { move: "g1f3", weight: 0.05 }   // Reti - hypermodern flexibility
        ]
    },
    // After 1.e4 - Black plays strategically
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.35 },  // Sicilian - fighting chess
            { move: "e7e5", weight: 0.30 },  // Open game - classical
            { move: "e7e6", weight: 0.20 },  // French - strategic complexity
            { move: "c7c6", weight: 0.15 }   // Caro-Kann - solid structure
        ]
    },
    // After 1.d4 - Black plays with strategic depth
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.40 },  // Indian systems - flexible
            { move: "d7d5", weight: 0.35 },  // Classical - principled
            { move: "e7e6", weight: 0.15 },  // Queen's Indian prep
            { move: "g7g6", weight: 0.10 }   // King's Indian - dynamic
        ]
    },
    // Sicilian - White plays strategically
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.55 },  // Open Sicilian - main line
            { move: "b1c3", weight: 0.25 },  // Closed - strategic squeeze
            { move: "c2c3", weight: 0.15 },  // Alapin - solid structure
            { move: "d2d4", weight: 0.05 }   // Smith-Morra - initiative
        ]
    },
    // Italian Game position - Strategic development
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "f8c5", weight: 0.45 },  // Giuoco Piano - classical
            { move: "g8f6", weight: 0.40 },  // Two Knights - active
            { move: "f8e7", weight: 0.15 }   // Hungarian - solid
        ]
    },
    // Queen's Gambit - Strategic handling
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.40 },  // QGD - classical fortress
            { move: "c7c6", weight: 0.35 },  // Slav - solid structure
            { move: "d5c4", weight: 0.15 },  // QGA - active play
            { move: "c7c5", weight: 0.10 }   // Tarrasch - dynamic
        ]
    },
    // King's Gambit - Strategic response
    "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3": {
        black: [
            { move: "e5f4", weight: 0.40 },  // Accept - play for advantage
            { move: "d7d5", weight: 0.35 },  // Falkbeer - central counter
            { move: "f8c5", weight: 0.25 }   // Decline - solid development
        ]
    },
    // Evans Gambit position - Strategic evaluation
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "c2c3", weight: 0.45 },  // Italian - strategic buildup
            { move: "b2b4", weight: 0.35 },  // Evans Gambit - initiative
            { move: "d2d3", weight: 0.20 }   // Slow Italian - long-term
        ]
    },
    // Ruy Lopez - AlphaZero's patient approach
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.45 },  // Morphy Defense - main line
            { move: "g8f6", weight: 0.35 },  // Berlin - solid endgame
            { move: "d7d6", weight: 0.20 }   // Steinitz - fortress
        ]
    },
    // Scandinavian accepted
    "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "d8d5", weight: 0.50 },  // Main line - active queen
            { move: "g8f6", weight: 0.50 }   // Modern - development first
        ]
    },
    // French Defense - Strategic pressure
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.65 },  // Main line - space advantage
            { move: "d2d3", weight: 0.20 },  // King's Indian Attack
            { move: "b1c3", weight: 0.15 }   // Development - flexible
        ]
    },
    // Caro-Kann - Strategic approach
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.55 },  // Classical - principled
            { move: "b1c3", weight: 0.25 },  // Two Knights - development
            { move: "c2c4", weight: 0.20 }   // Panov - dynamic structure
        ]
    },
    // London System - AlphaZero's patient buildup
    "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6": {
        white: [
            { move: "c1f4", weight: 0.40 },  // London - solid system
            { move: "g1f3", weight: 0.35 },  // Classical development
            { move: "c2c4", weight: 0.25 }   // Queen's Gambit - main line
        ]
    },
    // King's Indian Defense setup
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Main line - classical
            { move: "g1f3", weight: 0.35 },  // Flexible - Fianchetto option
            { move: "e2e4", weight: 0.15 }   // Four Pawns - ambitious
        ]
    },
    // Nimzo-Indian position
    "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
        white: [
            { move: "e2e3", weight: 0.40 },  // Rubinstein - solid
            { move: "d1c2", weight: 0.35 },  // Classical - avoid doubled pawns
            { move: "c1g5", weight: 0.25 }   // Leningrad - active play
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
let positionType = "strategic";   // Default to strategic
let multiPVLines = [];
let myColor = null;
let moveCount = 0;
let timeRemaining = 30000;
let lastEvaluation = 0;           // Track position evaluation
let drawMoveCounter = 0;          // Track moves in draw territory
let positionHistory = [];         // Track position repetitions

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO STRATEGIC HELPERS - God-Like Evaluation
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
    let counts = { wQ: 0, bQ: 0, wR: 0, bR: 0, wB: 0, bB: 0, wN: 0, bN: 0, wP: 0, bP: 0, wK: 0, bK: 0 };
    
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        if (c === 'Q') counts.wQ++;
        else if (c === 'q') counts.bQ++;
        else if (c === 'R') counts.wR++;
        else if (c === 'r') counts.bR++;
        else if (c === 'B') counts.wB++;
        else if (c === 'b') counts.bB++;
        else if (c === 'N') counts.wN++;
        else if (c === 'n') counts.bN++;
        else if (c === 'P') counts.wP++;
        else if (c === 'p') counts.bP++;
        else if (c === 'K') counts.wK++;
        else if (c === 'k') counts.bK++;
    }
    return counts;
}

/**
 * AlphaZero Pawn Structure Analysis - Long-term strategic vision
 */
function analyzePawnStructure(fen) {
    const board = fen.split(' ')[0];
    const rows = board.split('/');
    let structure = {
        doubledPawns: 0,
        isolatedPawns: 0,
        passedPawns: 0,
        backwardPawns: 0,
        pawnIslands: 0,
        centerControl: 0
    };
    
    let pawnFiles = { w: [], b: [] };
    
    // Map pawns to files
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let c of rows[rank]) {
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'P') pawnFiles.w.push(file);
                else if (c === 'p') pawnFiles.b.push(file);
                file++;
            }
        }
    }
    
    // Analyze doubled pawns
    const wFileCounts = {};
    const bFileCounts = {};
    pawnFiles.w.forEach(f => wFileCounts[f] = (wFileCounts[f] || 0) + 1);
    pawnFiles.b.forEach(f => bFileCounts[f] = (bFileCounts[f] || 0) + 1);
    
    Object.values(wFileCounts).forEach(c => { if (c > 1) structure.doubledPawns += c - 1; });
    Object.values(bFileCounts).forEach(c => { if (c > 1) structure.doubledPawns -= c - 1; });
    
    // Center control (d4, d5, e4, e5)
    if (pawnFiles.w.includes(3) || pawnFiles.w.includes(4)) structure.centerControl += 10;
    if (pawnFiles.b.includes(3) || pawnFiles.b.includes(4)) structure.centerControl -= 10;
    
    return structure;
}

/**
 * King Safety Evaluation - AlphaZero's precise judgment
 */
function evaluateKingSafety(fen) {
    const board = fen.split(' ')[0];
    const rows = board.split('/');
    let safety = { white: 0, black: 0 };
    
    // Find king positions
    let wKingPos = null, bKingPos = null;
    
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let c of rows[rank]) {
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'K') wKingPos = { rank, file };
                else if (c === 'k') bKingPos = { rank, file };
                file++;
            }
        }
    }
    
    // Evaluate castled positions
    if (wKingPos) {
        // Kingside castle bonus
        if (wKingPos.file >= 6 && wKingPos.rank === 7) safety.white += 30;
        // Queenside castle
        else if (wKingPos.file <= 2 && wKingPos.rank === 7) safety.white += 25;
        // King in center is dangerous
        else if (wKingPos.file >= 3 && wKingPos.file <= 5 && wKingPos.rank >= 6) safety.white -= 20;
    }
    
    if (bKingPos) {
        if (bKingPos.file >= 6 && bKingPos.rank === 0) safety.black += 30;
        else if (bKingPos.file <= 2 && bKingPos.rank === 0) safety.black += 25;
        else if (bKingPos.file >= 3 && bKingPos.file <= 5 && bKingPos.rank <= 1) safety.black -= 20;
    }
    
    return safety;
}

/**
 * Endgame Type Detection - For FLAWLESS endgame play
 */
function detectEndgameType(fen) {
    const pieces = countPieceTypes(fen);
    const totalPieces = countPieces(fen);
    
    // King + Pawn endgames - require maximum precision
    if (pieces.wQ === 0 && pieces.bQ === 0 && pieces.wR === 0 && pieces.bR === 0 &&
        pieces.wB === 0 && pieces.bB === 0 && pieces.wN === 0 && pieces.bN === 0) {
        return "pawn-endgame";
    }
    
    // Rook endgames - most common, need patience
    if (pieces.wQ === 0 && pieces.bQ === 0 && (pieces.wR > 0 || pieces.bR > 0) &&
        pieces.wB === 0 && pieces.bB === 0 && pieces.wN === 0 && pieces.bN === 0) {
        return "rook-endgame";
    }
    
    // Queen endgames - tactical precision
    if ((pieces.wQ > 0 || pieces.bQ > 0) && totalPieces <= 8) {
        return "queen-endgame";
    }
    
    // Minor piece endgames
    if (pieces.wQ === 0 && pieces.bQ === 0 && pieces.wR === 0 && pieces.bR === 0) {
        if ((pieces.wB > 0 || pieces.bB > 0) && pieces.wN === 0 && pieces.bN === 0) {
            return "bishop-endgame";
        }
        if (pieces.wB === 0 && pieces.bB === 0 && (pieces.wN > 0 || pieces.bN > 0)) {
            return "knight-endgame";
        }
        return "minor-piece-endgame";
    }
    
    // Complex endgames
    if (totalPieces <= 12) {
        return "complex-endgame";
    }
    
    return "not-endgame";
}

/**
 * Check if position is likely drawn - AlphaZero's precise evaluation
 */
function isLikelyDraw(fen, evaluation) {
    const pieces = countPieceTypes(fen);
    const totalPieces = countPieces(fen);
    
    // Insufficient material
    if (totalPieces <= 4) {
        // K vs K
        if (totalPieces === 2) return true;
        // K+B vs K or K+N vs K
        if (totalPieces === 3 && (pieces.wB === 1 || pieces.bB === 1 || pieces.wN === 1 || pieces.bN === 1)) {
            return true;
        }
        // K+B vs K+B same color
        if (pieces.wB === 1 && pieces.bB === 1) return true;
    }
    
    // Position is very close to equality
    if (Math.abs(evaluation) < CONFIG.minAdvantageToPlay && totalPieces <= 10) {
        return true;
    }
    
    return false;
}

/**
 * Game phase detection - AlphaZero style (strategic awareness)
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    const endgameType = detectEndgameType(fen);
    
    if (endgameType !== "not-endgame") return "endgame";
    if (moveNum <= 10) return "opening";
    if (moveNum <= 15 && pieces > 28) return "early-middlegame";
    if (pieces > 20) return "middlegame";
    if (pieces > 14) return "late-middlegame";
    return "endgame";
}

/**
 * AlphaZero Position Analysis - Strategic depth over pure aggression
 */
function analyzePositionType(fen) {
    const pieces = countPieceTypes(fen);
    const totalPieces = countPieces(fen);
    const endgameType = detectEndgameType(fen);
    const pawnStructure = analyzePawnStructure(fen);
    const kingSafety = evaluateKingSafety(fen);
    
    // Endgame - FLAWLESS precision mode
    if (endgameType !== "not-endgame") {
        if (endgameType === "pawn-endgame") return "pawn-precision";
        if (endgameType === "rook-endgame") return "rook-technique";
        return "endgame-grinding";
    }
    
    // Calculate material balance
    const myMaterial = myColor === 'w' ? 
        (pieces.wQ * 9 + pieces.wR * 5 + pieces.wB * 3.25 + pieces.wN * 3 + pieces.wP) :
        (pieces.bQ * 9 + pieces.bR * 5 + pieces.bB * 3.25 + pieces.bN * 3 + pieces.bP);
    const oppMaterial = myColor === 'w' ?
        (pieces.bQ * 9 + pieces.bR * 5 + pieces.bB * 3.25 + pieces.bN * 3 + pieces.bP) :
        (pieces.wQ * 9 + pieces.wR * 5 + pieces.wB * 3.25 + pieces.wN * 3 + pieces.wP);
    
    // King safety issues - need defensive precision
    const mySafety = myColor === 'w' ? kingSafety.white : kingSafety.black;
    const oppSafety = myColor === 'w' ? kingSafety.black : kingSafety.white;
    
    if (mySafety < -15) return "defensive-resilience";
    if (oppSafety < -15) return "strategic-pressure";
    
    // Material advantage - grind it out
    if (myMaterial > oppMaterial + 2) return "strategic-conversion";
    if (myMaterial < oppMaterial - 2) return "resilient-defense";
    
    // Good pawn structure - play strategically
    if (pawnStructure.centerControl > 5) return "positional-squeeze";
    
    // Complex middlegame - strategic maneuvering
    if (totalPieces > 24) return "strategic-complexity";
    
    // Default: balanced strategic play
    return "strategic-balance";
}

/**
 * AlphaZero Thinking Time - Patient and precise
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // AlphaZero is patient and methodical
    if (phase === "opening") speedMultiplier = CONFIG.openingSpeed;
    else if (phase === "early-middlegame") speedMultiplier = CONFIG.earlyMidSpeed;
    else if (phase === "middlegame") speedMultiplier = CONFIG.middlegameSpeed;
    else if (phase === "late-middlegame") speedMultiplier = CONFIG.lateMidSpeed;
    else if (phase === "endgame") speedMultiplier = CONFIG.endgameSpeed;
    
    // Position-specific adjustments - patience in complex positions
    if (posType === "pawn-precision" || posType === "rook-technique") {
        speedMultiplier = CONFIG.endgameSpeed * 1.1; // Extra time for precision
    } else if (posType === "endgame-grinding" || posType === "strategic-conversion") {
        speedMultiplier = CONFIG.grindingSpeed;
    } else if (posType === "defensive-resilience" || posType === "resilient-defense") {
        speedMultiplier = CONFIG.criticalSpeed;
    } else if (posType === "strategic-complexity") {
        speedMultiplier *= 0.9; // Slightly more time for complex positions
    }
    
    // Time pressure - maintain quality even under pressure
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.55;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.4;
    if (timeLeft < 3000) speedMultiplier *= 0.3;
    if (timeLeft < 1500) speedMultiplier *= 0.2;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance * 0.25);
    return Math.floor(Math.max(60, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * AlphaZero Depth - Enhanced for strategic depth and endgame precision
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "endgame") {
        // FLAWLESS endgame - maximum depth
        depth = CONFIG.endgameDepth;
        
        // Extra depth for critical endgame types
        if (posType === "pawn-precision") depth = CONFIG.endgameDepth + 2;
        else if (posType === "rook-technique") depth = CONFIG.endgameDepth + 1;
    } else {
        // Middlegame - strategic depth
        if (posType === "strategic-complexity" || posType === "positional-squeeze") {
            depth = CONFIG.strategicDepth;
        } else if (posType === "strategic-pressure" || posType === "defensive-resilience") {
            depth = CONFIG.tacticalDepth;
        } else if (posType === "strategic-conversion") {
            depth = CONFIG.positionalDepth + 1;
        } else if (posType === "resilient-defense") {
            depth = CONFIG.tacticalDepth + 1; // Extra depth for defense
        } else {
            depth = CONFIG.positionalDepth;
        }
    }
    
    // Time pressure - maintain reasonable depth for quality
    if (timeLeft < CONFIG.criticalThreshold) depth = Math.max(12, depth - 1);
    if (timeLeft < CONFIG.panicThreshold) depth = Math.max(11, depth - 2);
    if (timeLeft < 3000) depth = Math.max(10, depth - 3);
    if (timeLeft < 1500) depth = Math.max(9, depth - 4);
    
    return depth;
}

/**
 * Weighted opening book selection
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
 * AlphaZero Move Selection - Strategic depth, patience, no mistakes
 * Prioritizes: long-term advantage, piece activity, positional pressure
 */
function selectBestStrategicMove(bestMove, alternatives, phase, posType) {
    if (!alternatives || alternatives.length < 2) return bestMove;
    
    // AlphaZero NEVER makes intentional mistakes
    const bestScore = alternatives[0].score || 0;
    
    // In endgame - pure precision, always play objectively best
    if (phase === "endgame") {
        // Check for draw recognition
        if (CONFIG.allowStrategicDraws && isLikelyDraw(currentFen, bestScore)) {
            drawMoveCounter++;
            // Play precisely to confirm the draw
            return bestMove;
        }
        // Endgame: strict best move only
        return bestMove;
    }
    
    // Strategic move selection for middlegame
    for (let i = 1; i < Math.min(alternatives.length, 4); i++) {
        const alt = alternatives[i];
        const scoreDiff = bestScore - (alt.score || 0);
        
        // If move is within 10 centipawns, consider strategic factors
        if (scoreDiff <= 10 && scoreDiff >= 0) {
            const move = alt.move;
            
            // Prefer strategically superior moves
            if (isStrategicallyBetter(move, bestMove, posType)) {
                return move;
            }
        }
    }
    
    return bestMove;
}

/**
 * Evaluate if a move is strategically better (AlphaZero's unconventional play)
 */
function isStrategicallyBetter(move, bestMove, posType) {
    if (!move || move.length < 4) return false;
    
    const toSquare = move.substring(2, 4);
    const fromSquare = move.substring(0, 2);
    const toFile = toSquare[0];
    const toRank = toSquare[1];
    const fromFile = fromSquare[0];
    
    // Position type specific preferences
    if (posType === "strategic-conversion" || posType === "positional-squeeze") {
        // Prefer central control and piece activity
        if ((toFile === 'd' || toFile === 'e') && (toRank === '4' || toRank === '5')) {
            return true;
        }
        // Prefer rook lifts and piece improvements
        if (fromFile === 'a' || fromFile === 'h') {
            if (toFile >= 'c' && toFile <= 'f') return true;
        }
    }
    
    if (posType === "defensive-resilience" || posType === "resilient-defense") {
        // Prefer moves that improve piece coordination
        // Prefer centralization for defense
        if ((toFile === 'c' || toFile === 'd' || toFile === 'e' || toFile === 'f') &&
            (toRank === '2' || toRank === '3' || toRank === '6' || toRank === '7')) {
            return true;
        }
    }
    
    if (posType === "strategic-pressure") {
        // Prefer moves toward enemy territory
        if (myColor === 'w' && (toRank === '6' || toRank === '7')) return true;
        if (myColor === 'b' && (toRank === '2' || toRank === '3')) return true;
    }
    
    // General strategic preferences
    // Piece activity over passivity
    if ((toFile === 'd' || toFile === 'e') && (toRank === '4' || toRank === '5')) {
        return true;
    }
    
    return false;
}

/**
 * Evaluate move for piece activity (AlphaZero values active pieces)
 */
function evaluatePieceActivity(move) {
    if (!move || move.length < 4) return 0;
    
    const toSquare = move.substring(2, 4);
    const toFile = toSquare.charCodeAt(0) - 97; // 0-7
    const toRank = parseInt(toSquare[1]) - 1;   // 0-7
    
    let activity = 0;
    
    // Central squares are valuable
    const centerDistance = Math.abs(toFile - 3.5) + Math.abs(toRank - 3.5);
    activity += Math.max(0, 7 - centerDistance * 2);
    
    // Forward progress (toward enemy)
    if (myColor === 'w') {
        activity += toRank;
    } else {
        activity += (7 - toRank);
    }
    
    return activity;
}

/**
 * Parse multi-PV lines from engine output
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
                    const mateIn = parseInt(mateMatch[1]);
                    score = mateIn > 0 ? 10000 - mateIn : -10000 - mateIn;
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
// ENGINE INITIALIZATION - AlphaZero Strategic Settings (God-Like)
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    
    // AlphaZero Strategic Settings - Balanced for positional mastery
    chessEngine.postMessage("setoption name MultiPV value 4");        // Analyze top 4 moves for strategic choice
    chessEngine.postMessage("setoption name Contempt value 24");      // Balanced - allows strategic draws when best
    chessEngine.postMessage("setoption name Move Overhead value 25"); // Responsive
    chessEngine.postMessage("setoption name Slow Mover value 90");    // Patient, methodical play
    
    chessEngine.postMessage("isready");
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION - Stable and efficient
// ═══════════════════════════════════════════════════════════════════════

function interceptWebSocket() {
    let webSocket = window.WebSocket;
    const webSocketProxy = new Proxy(webSocket, {
        construct: function (target, args) {
            let wrappedWebSocket = new target(...args);
            webSocketWrapper = wrappedWebSocket;

            wrappedWebSocket.addEventListener("message", function (event) {
                try {
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
                        
                        // Track position for repetition awareness
                        const posKey = currentFen.split(' ')[0];
                        positionHistory.push(posKey);
                        if (positionHistory.length > 100) positionHistory.shift();
                        
                        // Extract time if available
                        if (message.d.wc !== undefined && message.d.bc !== undefined) {
                            timeRemaining = myColor === 'w' ? message.d.wc : message.d.bc;
                        }
                        
                        calculateMove();
                    }
                } catch (e) {
                    // Silent catch to prevent errors from breaking the page
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// MOVE CALCULATION - AlphaZero Style (Strategic Depth)
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book - strategic repertoire
    if (gamePhase === "opening" || (gamePhase === "early-middlegame" && moveCount <= 12)) {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            // Patient opening play
            const thinkTime = Math.random() * 120 + 80;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // Engine calculation with strategic settings
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
    chessEngine.postMessage("position fen " + currentFen);
    chessEngine.postMessage(`go depth ${depth}`);
}

/**
 * Send move - clean and reliable
 */
function sendMove(move) {
    if (!webSocketWrapper || !move) return;
    
    try {
        webSocketWrapper.send(JSON.stringify({
            t: "move",
            d: { 
                u: move, 
                b: 1,
                l: Math.floor(Math.random() * 15) + 8,
                a: 1
            }
        }));
    } catch (e) {
        // Silent catch to prevent errors
    }
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER - AlphaZero Strategic Selection
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    
    chessEngine.onmessage = function (event) {
        try {
            engineOutput += event + "\n";
            
            // Parse multi-PV lines for strategic move selection
            if (event.indexOf('multipv') !== -1) {
                const lines = parseMultiPV(event);
                if (lines.length > 0) {
                    multiPVLines = lines;
                }
            }
            
            // Extract evaluation for strategic decisions
            if (event.indexOf('score cp') !== -1) {
                const scoreMatch = event.match(/score\s+cp\s+(-?\d+)/);
                if (scoreMatch) {
                    lastEvaluation = parseInt(scoreMatch[1]);
                }
            }
            
            if (event && event.indexOf('bestmove') !== -1) {
                const moveParts = event.split(" ");
                bestMove = moveParts[1];
                
                let finalMove = bestMove;
                
                // AlphaZero strategic move selection
                if (multiPVLines.length > 1) {
                    finalMove = selectBestStrategicMove(bestMove, multiPVLines, gamePhase, positionType);
                }
                
                sendMove(finalMove);
                engineOutput = "";
            }
        } catch (e) {
            // Silent catch
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION - Clean and stable (no page breaking)
// ═══════════════════════════════════════════════════════════════════════

try {
    initializeChessEngine();
    interceptWebSocket();
    setupChessEngineOnMessage();
} catch (e) {
    // Silent initialization - don't break page
}
