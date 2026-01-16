
import React from 'react';

const FIREWORK_PARTICLES = 25;

export const Fireworks: React.FC = () => {
  const fireworks = Array.from({ length: 5 }).map((_, i) => {
    const top = `${Math.random() * 80 + 10}%`;
    const left = `${Math.random() * 80 + 10}%`;
    const delay = `${Math.random() * 1.5}s`;

    const particles = Array.from({ length: FIREWORK_PARTICLES }).map((_, pIndex) => {
      const angle = (pIndex / FIREWORK_PARTICLES) * 360;
      const particleStyle = {
        transform: `rotate(${angle}deg) translateY(-50px)`,
        animationDelay: `${Math.random() * 0.2}s`,
        backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
      };
      return <div key={pIndex} className="firework" style={particleStyle}></div>;
    });

    return (
      <div key={i} style={{ top, left, animationDelay: delay }} className="absolute">
        {particles}
      </div>
    );
  });

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {fireworks}
    </div>
  );
};
