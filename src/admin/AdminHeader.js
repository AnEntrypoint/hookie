import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import { styles } from './adminHeaderStyles';

export default function AdminHeader({ currentRoute, syncStatus, showNotification, onRefresh, onDismissNotification }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' && window.innerWidth > 768);

  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth > 768;
      setIsDesktop(desktop);
      if (desktop) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape' && mobileMenuOpen) setMobileMenuOpen(false); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { href: '#/admin', label: 'Pages', icon: 'P' },
    { href: '#/admin/components', label: 'Components', icon: 'C' },
    { href: '#/admin/library', label: 'Library', icon: 'L' },
    { href: '#/admin/layout', label: 'Layout', icon: 'Y' },
    { href: '#/admin/settings', label: 'Settings', icon: 'S' },
  ];

  const isActive = (item) => {
    if (!currentRoute) return false;
    const specificItems = navItems.filter(n => n.href !== '#/admin');
    if (item.href === '#/admin') {
      return currentRoute.startsWith('/admin/pages') || !specificItems.some(n => currentRoute.startsWith(n.href.replace('#', '')));
    }
    return currentRoute.startsWith(item.href.replace('#', ''));
  };

  const handleNavClick = (href) => { window.location.hash = href; setMobileMenuOpen(false); };

  return (
    <>
      {mobileMenuOpen && <div style={styles.backdrop} onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />}

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>Hookie</h1>
          <nav style={{ ...styles.nav, display: isDesktop ? 'flex' : 'none' }}>
            {navItems.map(item => (
              <a key={item.href} href={item.href} style={{ ...styles.navLink, ...(isActive(item) ? styles.navLinkActive : {}) }}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div style={styles.headerRight}>
          {syncStatus && (
            <div style={styles.syncStatus}>
              {syncStatus.online ? (
                <span style={styles.syncOnline}>Online {syncStatus.lastSync && `(${formatTime(syncStatus.lastSync)})`}</span>
              ) : (
                <span style={styles.syncOffline}>Offline</span>
              )}
            </div>
          )}
          <Auth />
          <button
            style={{ ...styles.mobileMenuButton, display: isDesktop ? 'none' : 'flex' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <span style={styles.hamburgerX}>x</span>
            ) : (
              <>
                <span style={styles.hamburgerLine} />
                <span style={styles.hamburgerLine} />
                <span style={styles.hamburgerLine} />
              </>
            )}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav style={styles.mobileMenuDrawer}>
          <div style={styles.menuHeader}>
            <h2 style={styles.menuTitle}>Navigation</h2>
            <button style={styles.closeButton} onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">x</button>
          </div>
          <div style={styles.menuContent}>
            {navItems.map(item => (
              <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }} style={{ ...styles.menuItem, ...(isActive(item) ? styles.menuItemActive : {}) }}>
                <span style={styles.menuItemIcon}>{item.icon}</span>
                <span style={styles.menuItemLabel}>{item.label}</span>
              </a>
            ))}
          </div>
        </nav>
      )}

      {showNotification && (
        <div style={styles.notification}>
          <span>New changes detected in repository</span>
          <div style={styles.notificationActions}>
            <button onClick={onRefresh} style={styles.refreshButton}>Refresh</button>
            <button onClick={onDismissNotification} style={styles.dismissButton}>Dismiss</button>
          </div>
        </div>
      )}
    </>
  );
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const diffMins = Math.floor((Date.now() - date) / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}
