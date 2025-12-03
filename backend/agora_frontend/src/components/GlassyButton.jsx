import React, { useRef, useEffect, useState } from 'react';
import './GlassyButton.css';

/*
 GlassyButton: pulsing glow on hover, with ordered cursors flying in to form
 a concentric ring around the button. Cursors are angled toward the button,
 avoid overlapping the button (ring radius > button), show subtle trail.
*/
export default function GlassyButton({ children, onClick, className='' }) {
  const btnRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Precompute cursor positions around a ring
  // Build multiple concentric rings for a layered circle of cursors
  const rings = [
    { count: 16, radius: 80 },
    { count: 20, radius: 110 },
    { count: 24, radius: 140 },
  ];
  const cursors = rings.flatMap((ring, rIndex) => {
    return Array.from({ length: ring.count }).map((_, i) => {
      const angle = (i / ring.count) * Math.PI * 2;
      return { angle, idx: `${rIndex}-${i}`, radius: ring.radius, order: rIndex * 100 + i };
    });
  });

  return (
    <div
      className={`glassy-btn-wrap ${hovered ? 'is-hovered' : ''} ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      ref={btnRef}
    >
      <button className={`glassy-btn glassy-btn--dark`}>
        {children}
      </button>
      {/* Cursor swarm container */}
      <div className="cursor-swarm" aria-hidden>
        {cursors.map(({ angle, idx, radius, order }) => {
          // Target ring position relative to center per ring
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const rotateDeg = (angle * 180) / Math.PI + 90; // point toward center
          // Staggered delays by ring then index for orderly fly-in
          const delay = order * 30; // ms
          return (
            <div
              key={idx}
              className="cursor-sprite"
              style={{
                '--tx': `${x}px`,
                '--ty': `${y}px`,
                '--rot': `${rotateDeg}deg`,
                '--delay': `${delay}ms`,
              }}
            >
              {/* Minimal cursor shape (angled) using CSS */}
              <div className="cursor-shape" />
            </div>
          );
        })}
      </div>
    </div>
  );
}