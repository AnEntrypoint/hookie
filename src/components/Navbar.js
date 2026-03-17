import React, { useState } from 'react';

export default function Navbar({
  logoText = 'My Site',
  links = [{ label: 'Home', href: '#/' }, { label: 'About', href: '#/pages/about' }],
  backgroundColor = '#ffffff',
  textColor = '#1e293b',
  sticky = false,
  ctaText = '',
  ctaHref = '#',
  style = {}
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    height: '64px',
    backgroundColor,
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    position: sticky ? 'sticky' : 'relative',
    top: sticky ? 0 : undefined,
    zIndex: sticky ? 100 : undefined,
    boxSizing: 'border-box',
    ...style
  };

  const logoStyle = {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: textColor,
    textDecoration: 'none',
    letterSpacing: '-0.5px',
  };

  const linkStyle = {
    color: textColor,
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.9375rem',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background-color 150ms',
    opacity: 0.85,
  };

  const ctaStyle = {
    backgroundColor: textColor,
    color: backgroundColor,
    padding: '8px 20px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.875rem',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <nav className="navbar" style={navStyle}>
      <a href="#/" style={logoStyle}>{logoText}</a>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {(links || []).map((link, i) => (
          <a key={i} href={link.href} style={linkStyle}>{link.label}</a>
        ))}
        {ctaText && (
          <a href={ctaHref} style={{ ...ctaStyle, marginLeft: '12px' }}>{ctaText}</a>
        )}
      </div>
    </nav>
  );
}
