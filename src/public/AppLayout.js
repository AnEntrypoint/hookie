import React, { useState, useEffect } from 'react';

export default function AppLayout({ children, repoInfo, showAdmin = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;
    
    const handleClick = (e) => {
      if (!e.target.closest('.app-header')) {
        closeMobileMenu();
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleRouteChange = () => {
      closeMobileMenu();
    };
    
    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  return (
    <div style={styles.appLayout}>
      <a href="#main-content" style={styles.skipLink}>
        Skip to main content
      </a>
      
      <header className="app-header" style={styles.appHeader}>
        <div style={styles.headerContainer}>
          <div style={styles.logo}>
            <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Site Name</a>
          </div>
          <nav style={styles.mainNav}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="#/about" style={styles.navLink}>About</a>
            <a href="#/contact" style={styles.navLink}>Contact</a>
          </nav>
          <button style={{...styles.mobileMenuToggle, display: isMobile ? 'flex' : 'none'}} onClick={toggleMobileMenu}>
            ☰
          </button>
        </div>
        {mobileMenuOpen && (
          <nav style={styles.mobileNav}>
            <a href="/" onClick={closeMobileMenu} style={styles.mobileNavLink}>Home</a>
            <a href="#/about" onClick={closeMobileMenu} style={styles.mobileNavLink}>About</a>
            <a href="#/contact" onClick={closeMobileMenu} style={styles.mobileNavLink}>Contact</a>
          </nav>
        )}
      </header>
      
      <main id="main-content" style={styles.appMain}>
        {children}
      </main>
      
      <footer style={styles.appFooter}>
        <div style={styles.footerContainer}>
          <p style={styles.footerText}>
            {repoInfo && `Powered by ${repoInfo.owner}/${repoInfo.repo}`}
          </p>
          {showAdmin && (
            <a href="#/admin" style={styles.adminLink}>Admin</a>
          )}
        </div>
      </footer>
    </div>
  );
}

const styles = {
  appLayout: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  
  skipLink: {
    position: 'absolute',
    top: '-40px',
    left: 0,
    background: '#000',
    color: '#fff',
    padding: '12px',
    minHeight: '44px',
    minWidth: '44px',
    textDecoration: 'none',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center'
  },
  
  appHeader: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  
  headerContainer: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  
  mainNav: {
    display: 'flex',
    gap: '1rem'
  },
  
  navLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'opacity 0.2s',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px'
  },
  
  mobileMenuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '1.5rem',
    cursor: 'pointer',
    minWidth: '44px',
    minHeight: '44px',
    padding: '8px',
    '@media (max-width: 768px)': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: '#334155'
  },
  
  mobileNavLink: {
    color: '#ffffff',
    textDecoration: 'none',
    padding: '12px 8px',
    fontWeight: '500',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center'
  },
  
  appMain: {
    flex: '1',
    width: '100%',
    maxWidth: '100%',
    margin: '0 auto',
    padding: '1rem',
    boxSizing: 'border-box',
    overflowX: 'hidden'
  },
  
  appFooter: {
    backgroundColor: '#f1f5f9',
    borderTop: '1px solid #e2e8f0',
    padding: '2rem',
    marginTop: 'auto'
  },
  
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  footerText: {
    margin: 0,
    color: '#64748b',
    fontSize: '0.875rem'
  },
  
  adminLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '600',
    minHeight: '44px',
    minWidth: '44px',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px'
  }
};
