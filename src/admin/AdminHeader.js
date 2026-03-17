import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { styles } from './adminHeaderStyles';

export default function AdminHeader({
  currentRoute,
  currentPageName,
  syncStatus,
  showNotification,
  onRefresh,
  onDismissNotification,
  changesCount = 0,
  onPublish
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' && window.innerWidth > 768);
  const [showShortcuts, setShowShortcuts] = useState(false);

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

  const previewUrl = currentPageName
    ? `${window.location.origin}${window.location.pathname}#/pages/${currentPageName}`
    : `${window.location.origin}${window.location.pathname}#/`;

  return (
    <>
      {mobileMenuOpen && <div style={styles.backdrop} onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />}

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>Hookie</h1>
          {currentPageName && isDesktop && (
            <span style={breadcrumbStyle}>
              <span style={{ opacity: 0.4 }}>/</span>
              <span style={{ marginLeft: '8px', fontWeight: 500, fontSize: '0.875rem', color: '#64748b', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={previewBtnStyle}
            title="Preview site"
          >
            Preview
          </a>

          <button
            onClick={onPublish}
            style={{
              ...publishBtnStyle,
              backgroundColor: changesCount > 0 ? '#2563eb' : '#94a3b8',
            }}
            title={changesCount > 0 ? `Publish ${changesCount} change${changesCount !== 1 ? 's' : ''}` : 'No pending changes'}
          >
            Publish
            {changesCount > 0 && (
              <span style={badgeStyle}>{changesCount}</span>
            )}
          </button>

          <button
            onClick={() => setShowShortcuts(true)}
            style={helpBtnStyle}
            title="Keyboard shortcuts (?)"
          >
            ?
          </button>

          <Auth />

          <button
            style={{ ...styles.mobileMenuButton, display: isDesktop ? 'none' : 'flex' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <span style={styles.hamburgerX}>✕</span>
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
            <button style={styles.closeButton} onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">✕</button>
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

      {showShortcuts && (
        <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </>
  );
}

const breadcrumbStyle = {
  display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px', color: '#64748b',
};

const previewBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '4px',
  padding: '6px 14px', borderRadius: '8px',
  fontSize: '0.8125rem', fontWeight: 600, color: '#475569',
  textDecoration: 'none', border: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc', cursor: 'pointer',
  transition: 'all 150ms', minHeight: '32px',
};

const publishBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  padding: '6px 16px', borderRadius: '8px',
  fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff',
  border: 'none', cursor: 'pointer',
  transition: 'all 150ms', minHeight: '32px', position: 'relative',
};

const badgeStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minWidth: '18px', height: '18px', padding: '0 4px',
  backgroundColor: '#ffffff', color: '#2563eb',
  borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 800,
};

const helpBtnStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: '32px', height: '32px', borderRadius: '50%',
  fontSize: '0.875rem', fontWeight: 700, color: '#64748b',
  border: '1px solid #e2e8f0', backgroundColor: '#f8fafc',
  cursor: 'pointer', transition: 'all 150ms',
};
