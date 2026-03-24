import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { styles, breadcrumbStyle, previewBtnStyle, publishBtnStyle, badgeStyle, helpBtnStyle, themeBtnStyle } from './adminHeaderStyles';

function getPreviewUrl(currentPageName, origin, pathname) {
  if (!currentPageName) return origin + pathname + '#/';
  const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
  if (isLocal) return origin + pathname + '#/pages/' + currentPageName;
  return (origin + pathname).replace(/app\.html$/, '') + 'pages/' + currentPageName + '.html';
}

function getSiteUrl(origin, pathname) {
  const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
  if (isLocal) return origin + '/';
  return (origin + pathname).replace(/app\.html$/, '');
}

export default function AdminHeader({
  currentRoute, currentPageName, syncStatus, showNotification,
  onRefresh, onDismissNotification, changesCount = 0, lastAutosaved, onPublish
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' && window.innerWidth > 768);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');

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
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) setMobileMenuOpen(false);
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const tag = document.activeElement?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') setShowShortcuts(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('hookie_theme', next);
    setIsDark(!isDark);
  };

  const navItems = [
    { href: '#/admin', label: 'Pages', icon: '📄' },
    { href: '#/admin/components', label: 'Components', icon: '🧩' },
    { href: '#/admin/library', label: 'Library', icon: '📚' },
    { href: '#/admin/layout', label: 'Layout', icon: '🎨' },
    { href: '#/admin/settings', label: 'Settings', icon: '⚙️' },
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

  const previewUrl = getPreviewUrl(currentPageName, window.location.origin, window.location.pathname);
  const siteUrl = getSiteUrl(window.location.origin, window.location.pathname);

  return (
    <>
      {mobileMenuOpen && <div style={styles.backdrop} onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />}

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>⚓ Hookie</h1>
          {currentPageName && isDesktop && (
            <span style={breadcrumbStyle}>
              <span style={{ opacity: 0.4 }}>/</span>
              <span style={{ marginLeft: '8px', fontWeight: 500, fontSize: '0.875rem', color: 'var(--admin-text2)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentPageName}
              </span>
            </span>
          )}
          <nav style={{ ...styles.nav, display: isDesktop ? 'flex' : 'none' }}>
            {navItems.map(item => (
              <a key={item.href} href={item.href} style={{ ...styles.navLink, ...(isActive(item) ? styles.navLinkActive : {}) }}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div style={styles.headerRight}>
          <a href={siteUrl} target="_blank" rel="noopener noreferrer" style={previewBtnStyle} title="View published site">
            Site ↗
          </a>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={previewBtnStyle} title="Preview this page">
            Preview
          </a>
          {lastAutosaved && (
            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text2)', whiteSpace: 'nowrap' }} title={`Last autosaved: ${new Date(lastAutosaved).toLocaleTimeString()}`}>
              ● Saved
            </span>
          )}
          <button onClick={onPublish}
            style={{ ...publishBtnStyle, backgroundColor: changesCount > 0 ? 'var(--admin-accent)' : 'var(--admin-text3)' }}
            title={changesCount > 0 ? `Publish ${changesCount} change${changesCount !== 1 ? 's' : ''}` : 'No pending changes'}>
            Publish
            {changesCount > 0 && <span style={badgeStyle}>{changesCount}</span>}
          </button>
          <button onClick={toggleTheme} style={themeBtnStyle} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setShowShortcuts(true)} style={helpBtnStyle} title="Keyboard shortcuts (?)">?</button>
          <Auth />
          <button style={{ ...styles.mobileMenuButton, display: isDesktop ? 'none' : 'flex' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <span style={styles.hamburgerX}>✕</span> : (
              <><span style={styles.hamburgerLine} /><span style={styles.hamburgerLine} /><span style={styles.hamburgerLine} /></>
            )}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav style={styles.mobileMenuDrawer}>
          <div style={styles.menuHeader}>
            <h2 style={styles.menuTitle}>Navigation</h2>
            <button style={styles.closeButton} onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">✕</button>
          </div>
          <div style={styles.menuContent}>
            {navItems.map(item => (
              <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                style={{ ...styles.menuItem, ...(isActive(item) ? styles.menuItemActive : {}) }}>
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

      {showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </>
  );
}