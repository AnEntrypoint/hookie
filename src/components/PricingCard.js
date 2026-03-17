import React from 'react';

export default function PricingCard({
  planName = 'Pro Plan',
  price = '$29',
  period = '/month',
  features = ['Feature one', 'Feature two', 'Feature three', 'Feature four'],
  ctaText = 'Get Started',
  ctaHref = '#',
  highlighted = false,
  accentColor = '#2563eb',
  backgroundColor = '#ffffff',
  style = {}
}) {
  const cardStyle = {
    backgroundColor,
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    border: highlighted ? `2px solid ${accentColor}` : '2px solid #e2e8f0',
    boxShadow: highlighted ? `0 8px 32px rgba(37,99,235,0.2)` : '0 2px 8px rgba(0,0,0,0.06)',
    position: 'relative',
    ...style
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-14px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: accentColor,
    color: '#ffffff',
    padding: '4px 16px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  };

  const ctaStyle = {
    display: 'block',
    textAlign: 'center',
    padding: '14px 24px',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '1rem',
    textDecoration: 'none',
    transition: 'all 200ms ease',
    marginTop: '24px',
    backgroundColor: highlighted ? accentColor : 'transparent',
    color: highlighted ? '#ffffff' : accentColor,
    border: `2px solid ${accentColor}`,
  };

  return (
    <div className="pricing-card" style={cardStyle}>
      {highlighted && <div style={badgeStyle}>Most Popular</div>}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
          {planName}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: accentColor, lineHeight: 1 }}>
            {price}
          </span>
          <span style={{ fontSize: '0.9375rem', color: '#64748b' }}>{period}</span>
        </div>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(features || []).map((feature, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9375rem', color: '#374151' }}>
            <span style={{ color: accentColor, fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <a href={ctaHref} style={ctaStyle}>{ctaText}</a>
    </div>
  );
}
