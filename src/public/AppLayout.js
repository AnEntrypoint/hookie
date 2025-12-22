import React, { useState, useEffect } from 'react';

export default function AppLayout({ children, repoInfo, showAdmin = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
          <button style={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
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
    padding: '8px',
    textDecoration: 'none',
    zIndex: 100
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  
  mainNav: {
    display: 'flex',
    gap: '2rem'
  },
  
  navLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'opacity 0.2s'
  },
  
  mobileMenuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '1.5rem',
    cursor: 'pointer'
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
    padding: '0.5rem 0',
    fontWeight: '500'
  },
  
  appMain: {
    flex: '1',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
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
    fontWeight: '600'
  }
};
