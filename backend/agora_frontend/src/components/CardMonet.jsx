import React from 'react';
import './MonetTheme.css';

export default function CardMonet({ children, className='', style }) {
  return (
    <div className={`monet-card monet-card--pad ${className}`} style={style}>
      {children}
    </div>
  );
}