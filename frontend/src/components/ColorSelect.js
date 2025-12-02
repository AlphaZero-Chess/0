import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sword, Shield } from 'lucide-react';

const ColorSelect = ({ enemy, onSelect, onBack }) => {
  const [hoveredColor, setHoveredColor] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const colors = [
    {
      id: 'white',
      name: 'WHITE',
      subtitle: 'First Strike',
      description: 'Take the initiative. Strike first and control the tempo.',
      icon: Sword,
      gradient: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
      textColor: '#000',
      borderColor: '#fff',
      piece: '♔'
    },
    {
      id: 'black',
      name: 'BLACK',
      subtitle: 'Counter Attack',
      description: 'Let them come. Then crush their ambitions.',
      icon: Shield,
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%)',
      textColor: '#fff',
      borderColor: '#444',
      piece: '♚'
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" />
        {[...Array(30)].map((_, i) => (
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

      {/* Back Button */}
      <button
        data-testid="back-to-enemies-btn"
        onClick={onBack}
        className={`absolute top-8 left-8 z-20 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10 ${isReady ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          color: enemy?.color || '#ff0080',
          fontFamily: 'Orbitron, sans-serif'
        }}
      >
        <ArrowLeft size={20} />
        <span className="text-sm tracking-wider">BACK</span>
      </button>

      {/* Enemy Info */}
      <div className={`relative z-10 text-center mb-8 transition-all duration-700 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <p className="text-gray-500 text-sm tracking-widest mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          OPPONENT SELECTED
        </p>
        <div className="flex items-center justify-center gap-4">
          <span className="text-5xl" style={{ filter: `drop-shadow(0 0 20px ${enemy?.color})` }}>
            {enemy?.avatar}
          </span>
          <h2 
            className="text-3xl font-black tracking-wider"
            style={{ 
              fontFamily: 'Orbitron, sans-serif',
              color: enemy?.color,
              textShadow: `0 0 20px ${enemy?.color}` 
            }}
          >
            {enemy?.name}
          </h2>
        </div>
      </div>

      {/* Title */}
      <div className={`relative z-10 text-center mb-12 transition-all duration-700 delay-200 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 
          className="text-5xl md:text-6xl font-black tracking-wider mb-4"
          style={{ 
            fontFamily: 'Orbitron, sans-serif',
            color: '#fff',
            textShadow: '0 0 20px #ff0080, 0 0 40px #ff0080'
          }}
        >
          CHOOSE YOUR SIDE
        </h1>
        <p className="text-gray-400 text-lg tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          WILL YOU ATTACK OR DEFEND?
        </p>
      </div>

      {/* Color Cards */}
      <div className="relative z-10 flex flex-wrap justify-center gap-12 max-w-4xl px-4">
        {colors.map((color, index) => {
          const Icon = color.icon;
          const isHovered = hoveredColor === color.id;
          
          return (
            <div
              key={color.id}
              data-testid={`color-card-${color.id}`}
              className={`relative cursor-pointer transition-all duration-500 ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ 
                transitionDelay: `${400 + index * 150}ms`,
                transform: isHovered ? 'scale(1.05) translateY(-10px)' : 'scale(1)'
              }}
              onMouseEnter={() => setHoveredColor(color.id)}
              onMouseLeave={() => setHoveredColor(null)}
              onClick={() => onSelect(color.id)}
            >
              {/* Glow Effect */}
              <div 
                className="absolute -inset-4 rounded-3xl blur-2xl transition-opacity duration-500"
                style={{ 
                  background: color.id === 'white' 
                    ? 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(100,100,150,0.4) 0%, transparent 70%)',
                  opacity: isHovered ? 1 : 0 
                }}
              />
              
              {/* Card */}
              <div 
                className="relative w-72 rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: color.gradient,
                  border: `3px solid ${isHovered ? (color.id === 'white' ? '#fff' : '#666') : color.borderColor}`,
                  boxShadow: isHovered 
                    ? color.id === 'white' 
                      ? '0 0 60px rgba(255,255,255,0.5)' 
                      : '0 0 60px rgba(100,100,150,0.5)'
                    : 'none'
                }}
              >
                {/* Piece Display */}
                <div className="h-56 flex items-center justify-center relative">
                  <span 
                    className="text-9xl transition-all duration-500"
                    style={{ 
                      color: color.id === 'white' ? '#000' : '#fff',
                      filter: isHovered 
                        ? color.id === 'white'
                          ? 'drop-shadow(0 0 40px rgba(0,0,0,0.3))'
                          : 'drop-shadow(0 0 40px rgba(255,255,255,0.5))'
                        : 'none',
                      transform: isHovered ? 'scale(1.15)' : 'scale(1)'
                    }}
                  >
                    {color.piece}
                  </span>
                  
                  {/* VS indicator */}
                  {index === 0 && (
                    <div className="absolute -right-10 top-1/2 -translate-y-1/2 z-20">
                      <span 
                        className="text-4xl font-black"
                        style={{ 
                          fontFamily: 'Orbitron, sans-serif',
                          color: '#ff0080',
                          textShadow: '0 0 20px #ff0080'
                        }}
                      >
                        VS
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div 
                  className="p-6"
                  style={{ 
                    background: color.id === 'white' 
                      ? 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={24} style={{ color: color.textColor }} />
                    <h2 
                      className="text-2xl font-black tracking-wider"
                      style={{ 
                        fontFamily: 'Orbitron, sans-serif',
                        color: color.textColor
                      }}
                    >
                      {color.name}
                    </h2>
                  </div>
                  
                  <p 
                    className="text-sm mb-3 tracking-wider"
                    style={{ 
                      fontFamily: 'Rajdhani, sans-serif',
                      color: color.id === 'white' ? '#666' : '#888'
                    }}
                  >
                    {color.subtitle}
                  </p>
                  
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ 
                      fontFamily: 'Rajdhani, sans-serif',
                      color: color.id === 'white' ? '#444' : '#aaa'
                    }}
                  >
                    {color.description}
                  </p>

                  {/* Select Button */}
                  <button
                    data-testid={`select-${color.id}-btn`}
                    className="w-full mt-6 py-4 rounded-lg font-bold tracking-widest transition-all duration-300"
                    style={{ 
                      background: color.id === 'white' 
                        ? 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                      color: color.id === 'white' ? '#fff' : '#000',
                      fontFamily: 'Orbitron, sans-serif',
                      boxShadow: isHovered 
                        ? '0 0 30px rgba(255,0,128,0.4)'
                        : 'none'
                    }}
                  >
                    SELECT
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelect;
