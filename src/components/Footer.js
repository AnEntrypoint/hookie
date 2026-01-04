import React from 'react';

export default function Footer({ layout, className = '' }) {
  if (!layout?.footer?.enabled) return null;

  const footer = layout.footer;

  return (
    <footer
      className={className}
      style={{
        background: footer.backgroundColor || '#f5f5f5',
        color: footer.color || '#64748b',
        padding: footer.padding || '2rem 1rem',
        borderTop: footer.borderTop || '1px solid #e0e0e0',
        width: '100%',
        marginTop: 'auto'
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        {footer.sections?.map((section, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {section.title && (
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 0.5rem 0'
              }}>
                {section.title}
              </h4>
            )}
            {section.text && (
              <p style={{
                fontSize: '0.875rem',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {section.text}
              </p>
            )}
            {section.links && section.links.length > 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {section.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.path}
                    style={{
                      color: '#2563eb',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'opacity 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.target.style.opacity = '0.7'}
                    onMouseOut={(e) => e.target.style.opacity = '1'}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {footer.content && !footer.sections?.length && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          fontSize: '0.875rem'
        }}>
          {footer.content}
        </div>
      )}
    </footer>
  );
}
