import React from 'react';

export default function FooterBlock({
  copyrightText = 'My Site. All rights reserved.',
  links = [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }],
  backgroundColor = '#1e293b',
  textColor = '#94a3b8',
  showYear = true,
  style = {}
}) {
  const year = new Date().getFullYear();
  const displayCopyright = showYear ? `${year} ${copyrightText}` : copyrightText;

  return (
    <footer className="footer-block" style={{
      backgroundColor,
      color: textColor,
      padding: '32px 48px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      boxSizing: 'border-box',
      ...style
    }}>
      <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>
        &copy; {displayCopyright}
      </span>
      {links && links.length > 0 && (
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
          {links.map((link, i) => (
            <a key={i} href={link.href} style={{
              color: textColor, textDecoration: 'none', fontSize: '0.875rem',
              opacity: 0.75, transition: 'opacity 150ms'
            }}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </footer>
  );
}
