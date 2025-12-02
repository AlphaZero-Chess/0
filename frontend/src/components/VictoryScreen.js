import React, { useState, useEffect } from 'react';
import { Trophy, Skull, Scale, RotateCcw, Swords } from 'lucide-react';

const VictoryScreen = ({ winner, enemy, playerColor, onRestart }) => {
  const [isReady, setIsReady] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsReady(true), 100);
    const timer2 = setTimeout(() => {
      if (winner === 'player') setShowConfetti(true);
    }, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [winner]);

  const getResultConfig = () => {
    switch (winner) {
      case 'player':
        return {
          title: 'VICTORY',
          subtitle: 'YOU DEFEATED YOUR OPPONENT!',
          icon: Trophy,
          gradient: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
          color: '#ffd700',
          bgGlow: 'rgba(255, 215, 0, 0.3)',
          message: 'Your strategic brilliance has prevailed. The enemy has been vanquished!'
        };
      case 'enemy':
        return {
          title: 'DEFEAT',
          subtitle: 'YOU HAVE BEEN CONQUERED',
          icon: Skull,
          gradient: 'linear-gradient(135deg, #ff0040 0%, #8b0000 100%)',
          color: '#ff0040',
          bgGlow: 'rgba(255, 0, 64, 0.3)',
          message: 'The battle is lost, but not the war. Rise again and seek revenge!'
        };
      case 'draw':
        return {
          title: 'DRAW',
          subtitle: 'A STALEMATE HAS OCCURRED',
          icon: Scale,
          gradient: 'linear-gradient(135deg, #888888 0%, #444444 100%)',
          color: '#888888',
          bgGlow: 'rgba(136, 136, 136, 0.3)',
          message: 'Neither side could claim victory. The battlefield remains contested.'
        };
      default:
        return {
          title: 'GAME OVER',
          subtitle: '',
          icon: Swords,
          gradient: 'linear-gradient(135deg, #888888 0%, #444444 100%)',
          color: '#888888',
          bgGlow: 'rgba(136, 136, 136, 0.3)',
          message: ''
        };
    }
  };

  const config = getResultConfig();
  const Icon = config.icon;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" />
      
      {/* Animated glow effect */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at center, ${config.bgGlow} 0%, transparent 70%)`,
          opacity: isReady ? 1 : 0
        }}
      />

      {/* Confetti for victory */}
      {showConfetti && winner === 'player' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                background: ['#ffd700', '#ff8c00', '#ff0080', '#00ffff', '#80ff00'][Math.floor(Math.random() * 5)],
                animation: `fall ${2 + Math.random() * 3}s ease-out forwards`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${isReady ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        {/* Icon */}
        <div 
          className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-8"
          style={{
            background: config.gradient,
            boxShadow: `0 0 60px ${config.color}60, 0 0 120px ${config.color}30`,
            animation: 'pulse 2s infinite'
          }}
        >
          <Icon size={64} color="#fff" />
        </div>

        {/* Title */}
        <h1 
          className="text-7xl md:text-8xl font-black tracking-wider mb-4"
          style={{ 
            fontFamily: 'Orbitron, sans-serif',
            background: config.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `0 0 60px ${config.color}80`
          }}
        >
          {config.title}
        </h1>

        {/* Subtitle */}
        <p 
          className="text-xl md:text-2xl tracking-widest mb-8"
          style={{ 
            fontFamily: 'Rajdhani, sans-serif',
            color: config.color
          }}
        >
          {config.subtitle}
        </p>

        {/* Battle Summary */}
        <div 
          className={`max-w-xl mx-auto rounded-xl p-8 mb-10 transition-all duration-1000 delay-300 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{
            background: 'linear-gradient(180deg, rgba(30,30,50,0.9) 0%, rgba(15,15,30,0.95) 100%)',
            border: `2px solid ${config.color}40`,
            boxShadow: `0 0 40px ${config.color}20`
          }}
        >
          {/* VS Display */}
          <div className="flex items-center justify-center gap-8 mb-6">
            {/* Player */}
            <div className="text-center">
              <span className="text-5xl block mb-2">
                {playerColor === 'white' ? '♔' : '♚'}
              </span>
              <p className="text-sm text-gray-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                YOU
              </p>
            </div>
            
            {/* VS */}
            <div 
              className="text-3xl font-black"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                color: '#ff0080',
                textShadow: '0 0 20px #ff0080'
              }}
            >
              VS
            </div>
            
            {/* Enemy */}
            <div className="text-center">
              <span 
                className="text-5xl block mb-2"
                style={{ filter: `drop-shadow(0 0 15px ${enemy?.color})` }}
              >
                {enemy?.avatar}
              </span>
              <p 
                className="text-sm"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: enemy?.color }}
              >
                {enemy?.name}
              </p>
            </div>
          </div>

          {/* Message */}
          <p 
            className="text-gray-300 text-lg leading-relaxed"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}
          >
            {config.message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button
            data-testid="rematch-btn"
            onClick={onRestart}
            className="flex items-center gap-3 px-8 py-4 rounded-lg font-bold tracking-wider transition-all duration-300 hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #ff0080 0%, #7928ca 100%)',
              fontFamily: 'Orbitron, sans-serif',
              boxShadow: '0 0 30px rgba(255, 0, 128, 0.4)'
            }}
          >
            <RotateCcw size={20} />
            PLAY AGAIN
          </button>
          
          <button
            data-testid="new-enemy-btn"
            onClick={onRestart}
            className="flex items-center gap-3 px-8 py-4 rounded-lg font-bold tracking-wider transition-all duration-300 hover:scale-105 bg-white/10 hover:bg-white/20"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <Swords size={20} />
            NEW ENEMY
          </button>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default VictoryScreen;
