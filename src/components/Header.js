import React, { useState, useEffect } from 'react';

export default function Header({ layout, className = '' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!layout?.header?.enabled) return null;

  const header = layout.header;
  const logoItem = header.items?.find(item => item.type === 'logo');
  const navItem = header.items?.find(item => item.type === 'nav');

  const handleToggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={className}
      style={{
        background: header.backgroundColor || '#ffffff',
        padding: header.padding || '0.75rem 1rem',
        height: header.height || '64px',
        position: header.position || 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: header.borderBottom || 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: header.height || '64px'
      }}>
        {logoItem && (
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e293b'
          }}>
            {logoItem.text}
          </div>
        )}

        {navItem && (
          <>
            {!isMobile && (
              <nav style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}>
                {navItem.links?.map((link, index) => (
                  <a
                    key={index}
                    href={link.path}
                    style={{
                      color: '#1e293b',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'opacity 0.2s',
                      minWidth: '44px',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 12px',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.target.style.opacity = '0.7'}
                    onMouseOut={(e) => e.target.style.opacity = '1'}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}

            {isMobile && (
              <button
                onClick={handleToggleMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1e293b',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  minWidth: '44px',
                  minHeight: '44px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            )}
          </>
        )}
      </div>

      {mobileMenuOpen && isMobile && navItem && (
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          padding: '1rem 2rem',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          width: '100%',
          position: 'absolute',
          top: header.height || '64px',
          left: 0,
          right: 0,
          zIndex: 99
        }}>
          {navItem.links?.map((link, index) => (
            <a
              key={index}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: '#1e293b',
                textDecoration: 'none',
                padding: '12px 8px',
                fontWeight: '500',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
