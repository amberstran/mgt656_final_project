import React from 'react';
import './MonetTheme.css';

export default function ButtonMonet({ children, onClick, primary=false, style }) {
  const cls = primary ? 'monet-btn monet-btn--primary' : 'monet-btn';
  return (
    <button className={cls} onClick={onClick} style={style}>
      {children}
    </button>
  );
}