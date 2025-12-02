import React, { useState, useEffect } from 'react';
import { Sword, Shield, Zap, Crown, Star, Flame } from 'lucide-react';

const enemies = [
  {
    id: 'elegant',
    name: 'THE ELEGANT',
    subtitle: 'AlphaZero Style',
    description: 'Masterful positional play with beautiful sacrifices. Favors long-term strategic advantages over material.',
    traits: ['Positional Genius', 'Elegant Sacrifices', 'Strategic Depth'],
    color: '#00ffff',
    gradient: 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)',
    icon: Crown,
    difficulty: 'Master',
    openings: ['Italian Game', 'Ruy Lopez', "King's Indian"],
    style: 'Prioritizes piece activity and king safety. Makes long-term positional sacrifices.',
    avatar: '♚',
    skillLevel: 20,
    depth: 18
  },
  {
    id: 'nonelegant',
    name: 'THE CRUSHER',
    subtitle: 'Aggressive Beast',
    description: 'Relentless aggression and tactical chaos. Seeks to destroy through brute force calculation.',
    traits: ['Tactical Monster', 'Aggressive Play', 'Material Hunter'],
    color: '#ff0040',
    gradient: 'linear-gradient(135deg, #ff0040 0%, #ff8000 100%)',
    icon: Flame,
    difficulty: 'Brutal',
    openings: ['Sicilian Dragon', "King's Gambit", 'Evans Gambit'],
    style: 'Attacks relentlessly. Prioritizes tactics and material over position.',
    avatar: '♛',
    skillLevel: 20,
    depth: 20
  },
  {
    id: 'minia0',
    name: 'MINI ALPHA',
    subtitle: 'Rising Prodigy',
    description: 'A balanced approach combining positional understanding with tactical awareness. Perfect for learning.',
    traits: ['Balanced Style', 'Solid Defense', 'Adaptable'],
    color: '#80ff00',
    gradient: 'linear-gradient(135deg, #80ff00 0%, #00ff80 100%)',
    icon: Star,
    difficulty: 'Moderate',
    openings: ["Queen's Gambit", 'London System', 'Caro-Kann'],
    style: 'Balanced play with solid fundamentals. Good for practice.',
    avatar: '♞',
    skillLevel: 15,
    depth: 12
  }
];

const EnemySelect = ({ onSelect }) => {
  const [hoveredEnemy, setHoveredEnemy] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" />
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className={`relative z-10 text-center mb-12 transition-all duration-1000 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 
          className="text-6xl md:text-7xl font-black tracking-wider mb-4"
          style={{ 
            fontFamily: 'Orbitron, sans-serif',
            color: '#fff',
            textShadow: '0 0 20px #ff0080, 0 0 40px #ff0080, 0 0 60px #ff0080'
          }}
        >
          CHOOSE YOUR ENEMY
        </h1>
        <p className="text-gray-400 text-xl tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          SELECT A WORTHY OPPONENT
        </p>
      </div>

      {/* Enemy Cards */}
      <div className="relative z-10 flex flex-wrap justify-center gap-8 max-w-7xl px-4">
        {enemies.map((enemy, index) => {
          const Icon = enemy.icon;
          const isHovered = hoveredEnemy === enemy.id;
          const isSelected = selectedIndex === index;
          
          return (
            <div
              key={enemy.id}
              data-testid={`enemy-card-${enemy.id}`}
              className={`relative cursor-pointer transition-all duration-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                transform: isHovered ? 'scale(1.05) translateY(-10px)' : isSelected ? 'scale(1.02)' : 'scale(1)'
              }}
              onMouseEnter={() => setHoveredEnemy(enemy.id)}
              onMouseLeave={() => setHoveredEnemy(null)}
              onClick={() => {
                setSelectedIndex(index);
                onSelect(enemy);
              }}
            >
              {/* Glow Effect */}
              <div 
                className="absolute -inset-2 rounded-2xl blur-xl transition-opacity duration-500"
                style={{ 
                  background: enemy.gradient,
                  opacity: isHovered ? 0.5 : isSelected ? 0.3 : 0 
                }}
              />
              
              {/* Card */}
              <div 
                className="relative w-80 rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(30,30,50,0.95) 0%, rgba(15,15,30,0.98) 100%)',
                  border: `2px solid ${isHovered || isSelected ? enemy.color : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: isHovered ? `0 0 40px ${enemy.color}40` : 'none'
                }}
              >
                {/* Header */}
                <div 
                  className="relative h-48 flex items-center justify-center overflow-hidden"
                  style={{ background: `${enemy.gradient}20` }}
                >
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${enemy.color}20 10px, ${enemy.color}20 20px)`
                    }} />
                  </div>
                  
                  {/* Avatar */}
                  <span 
                    className="text-8xl transition-transform duration-500"
                    style={{ 
                      filter: `drop-shadow(0 0 30px ${enemy.color})`,
                      transform: isHovered ? 'scale(1.2)' : 'scale(1)'
                    }}
                  >
                    {enemy.avatar}
                  </span>
                  
                  {/* Difficulty Badge */}
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold tracking-wider"
                    style={{ 
                      background: enemy.gradient,
                      fontFamily: 'Orbitron, sans-serif'
                    }}
                  >
                    {enemy.difficulty.toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={24} style={{ color: enemy.color }} />
                    <h2 
                      className="text-2xl font-black tracking-wide"
                      style={{ 
                        fontFamily: 'Orbitron, sans-serif',
                        color: enemy.color 
                      }}
                    >
                      {enemy.name}
                    </h2>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {enemy.subtitle}
                  </p>
                  
                  <p className="text-gray-300 text-sm mb-5 leading-relaxed" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {enemy.description}
                  </p>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {enemy.traits.map((trait, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          background: `${enemy.color}20`,
                          color: enemy.color,
                          border: `1px solid ${enemy.color}40`,
                          fontFamily: 'Rajdhani, sans-serif'
                        }}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Skill Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      <span>SKILL LEVEL</span>
                      <span>{enemy.skillLevel}/20</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(enemy.skillLevel / 20) * 100}%`,
                          background: enemy.gradient
                        }}
                      />
                    </div>
                  </div>

                  {/* Fight Button */}
                  <button
                    data-testid={`fight-btn-${enemy.id}`}
                    className="w-full mt-4 py-4 rounded-lg font-bold tracking-widest text-white transition-all duration-300 hover:shadow-lg"
                    style={{ 
                      background: enemy.gradient,
                      fontFamily: 'Orbitron, sans-serif',
                      boxShadow: isHovered ? `0 0 30px ${enemy.color}60` : 'none'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(enemy);
                    }}
                  >
                    ⚔️ ENGAGE
                  </button>
                </div>
              </div>
            </div>
          );
        })}  
      </div>

      {/* Footer */}
      <div className={`relative z-10 mt-12 text-center transition-all duration-1000 delay-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-gray-500 text-sm tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          POWERED BY STOCKFISH 17 • NEURAL NETWORK CHESS ENGINE
        </p>
      </div>
    </div>
  );
};

export default EnemySelect;
