import React from 'react';
import './Landing.css';
import GlassyButton from './GlassyButton';

export default function Landing({ onEnter }) {
  return (
    <div className="landing-root">
      <div className="landing-stars" />
      <div className="landing-sky" />
      <div className="landing-card">
        <div className="landing-title">Agora</div>
        <div className="landing-pill">
          <span>Yale Grad Community: Connect, Share, Play</span>
        </div>
        <div className="landing-enter">
          <GlassyButton onClick={onEnter}>
            Enter Agora
          </GlassyButton>
        </div>
      </div>
    </div>
  );
}
