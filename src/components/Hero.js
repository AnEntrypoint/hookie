import React from 'react';

const BACKGROUNDS = {
  'white': '#ffffff',
  'light': '#f8fafc',
  'dark': '#1e293b',
  'blue': 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
  'purple': 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
  'green': 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
  'sunset': 'linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)',
  'midnight': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
};

export default function Hero({
  headline = 'Build Something Amazing',
  subheadline = 'The modern way to create websites with GitHub-powered content and visual editing.',
  ctaText = 'Get Started',
  ctaHref = '#',
  secondaryCtaText = '',
  secondaryCtaHref = '#',
  background = 'blue',
  backgroundImage = '',
  textAlign = 'center',
  textColor = '#ffffff',
  minHeight = '480px',
  style = {}
}) {
  const bg = BACKGROUNDS[background] || background || BACKGROUNDS.blue;
  const isGradient = bg.includes('gradient') || bg.includes('linear') || bg.includes('radial');

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: textAlign === 'center' ? 'center' : 'flex-start',
    justifyContent: 'center',
    minHeight,
    padding: '80px 48px',
    background: backgroundImage ? `url(${backgroundImage}) center/cover no-repeat` : bg,
    textAlign,
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    ...style
  };

  if (backgroundImage) {
    containerStyle.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage}) center/cover no-repeat`;
  }

  const headlineStyle = {
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-1px',
    color: textColor,
    margin: '0 0 24px 0',
    maxWidth: textAlign === 'center' ? '800px' : '700px',
    textShadow: isGradient || backgroundImage ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
  };

  const subheadlineStyle = {
    fontSize: 'clamp(1rem, 2.5vw, 1.375rem)',
    fontWeight: 400,
    lineHeight: 1.6,
    color: textColor,
    opacity: 0.9,
    margin: '0 0 40px 0',
    maxWidth: textAlign === 'center' ? '620px' : '560px',
  };

  const ctaRowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
    alignItems: 'center',
  };

  const primaryBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 32px',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '1rem',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    transition: 'all 200ms ease',
    minHeight: '52px',
  };

  const secondaryBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 32px',
    backgroundColor: 'transparent',
    color: textColor,
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '1rem',
    textDecoration: 'none',
    border: `2px solid ${textColor}`,
    cursor: 'pointer',
    opacity: 0.9,
    transition: 'all 200ms ease',
    minHeight: '52px',
  };

  return (
    <div className="hero" style={containerStyle}>
      {headline && <h1 style={headlineStyle}>{headline}</h1>}
      {subheadline && <p style={subheadlineStyle}>{subheadline}</p>}
      {(ctaText || secondaryCtaText) && (
        <div style={ctaRowStyle}>
          {ctaText && (
            <a href={ctaHref} style={primaryBtnStyle}>
              {ctaText}
            </a>
          )}
          {secondaryCtaText && (
            <a href={secondaryCtaHref} style={secondaryBtnStyle}>
              {secondaryCtaText}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
