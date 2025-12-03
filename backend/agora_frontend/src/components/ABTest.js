import React, { useState, useEffect } from 'react';

// Team member nicknames
const TEAM_MEMBERS = [
  "delightful-hamster",
  "light-hedgehog",
  "zealous-scorpion"
];

export default function ABTest() {
  const [buttonText, setButtonText] = useState('');
  const [variant, setVariant] = useState('');

  useEffect(() => {
    // Check if user already has an assigned variant in localStorage
    let storedVariant = localStorage.getItem('ab_variant');
    
    if (!storedVariant) {
      // Randomly assign variant A or B (50/50 split)
      storedVariant = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem('ab_variant', storedVariant);
    }
    
    setVariant(storedVariant);
    setButtonText(storedVariant === 'A' ? 'kudos' : 'thanks');
  }, []);

  const handleButtonClick = () => {
    console.log('Button clicked! Variant:', variant, 'Text:', buttonText);
    alert(`Button clicked! Text: ${buttonText}`);
  };

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        padding: '3rem',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{
          fontSize: '3rem',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>✨</div>
        
        <h1 style={{
          color: '#222',
          fontSize: '2.5rem',
          marginBottom: '1rem',
          textAlign: 'center',
          margin: 0
        }}>Team A/B Test</h1>
        
        <p style={{
          color: '#666',
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '1.1rem',
          marginTop: '0.5rem'
        }}>MGT656 Final Project</p>
        
        <div style={{
          color: '#667eea',
          fontSize: '1.3rem',
          fontWeight: '600',
          margin: '2rem 0 1rem 0'
        }}>Team Members</div>
        
        <ul style={{
          listStyle: 'none',
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '1.5rem',
          margin: 0
        }}>
          {TEAM_MEMBERS.map((member, index) => (
            <li key={index} style={{
              padding: '0.75rem 1rem',
              marginBottom: index === TEAM_MEMBERS.length - 1 ? 0 : '0.5rem',
              background: 'white',
              borderRadius: '8px',
              color: '#333',
              fontSize: '1.1rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
              👤 {member}
            </li>
          ))}
        </ul>
        
        <div style={{
          textAlign: 'center',
          marginTop: '2.5rem'
        }}>
          <button
            id="abtest"
            onClick={handleButtonClick}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: '700',
              padding: '1.25rem 3rem',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
            onMouseDown={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {buttonText}
          </button>
        </div>
        
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: '#999',
          fontSize: '0.9rem'
        }}>
          You are seeing Variant {variant}
        </div>
      </div>
    </div>
  );
}
