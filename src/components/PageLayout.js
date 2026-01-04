import React from 'react';
import Header from './Header.js';
import Footer from './Footer.js';

export default function PageLayout({ layout, children, pageTitle }) {
  const headerHeight = layout?.header?.height || '0px';
  const headerFixed = layout?.header?.position === 'fixed';
  const headerEnabled = layout?.header?.enabled !== false;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {headerEnabled && <Header layout={layout} />}

      <main style={{
        flex: 1,
        marginTop: headerFixed && headerEnabled ? headerHeight : 0,
        padding: layout?.page?.padding || '1rem',
        maxWidth: layout?.page?.maxWidth || '100%',
        margin: headerFixed && headerEnabled ? `${headerHeight} auto 0` : '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {children}
      </main>

      <Footer layout={layout} />
    </div>
  );
}
