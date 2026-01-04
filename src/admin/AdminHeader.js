import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import { breakpoints, minTouchSize } from './responsiveStyles';

export default function AdminHeader({
  currentRoute,
  syncStatus,
  showNotification,
  onRefresh,
  onDismissNotification
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const isActive = (route) => currentRoute && currentRoute.startsWith(route);

  const navItems = [
    { href: '#/admin', label: 'Pages', icon: '📄' },
    { href: '#/admin/components', label: 'Components', icon: '🧩' },
    { href: '#/admin/library', label: 'Library', icon: '📚' },
    { href: '#/admin/layout', label: 'Layout', icon: '🎨' },
    { href: '#/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleNavClick = (href) => {
    window.location.hash = href;
    setMobileMenuOpen(false);
  };

  return (
    <>
      {mobileMenuOpen && (
        <div
          style={styles.backdrop}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>CMS Admin</h1>
          <nav style={styles.nav}>
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  ...styles.navLink,
                  ...(isActive(item.href) && item.href !== '#/admin' ? styles.navLinkActive : isActive(item.href) && item.href === '#/admin' && !navItems.slice(1).some(n => isActive(n.href)) ? styles.navLinkActive : {})
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div style={styles.headerRight}>
          {syncStatus && (
            <div style={styles.syncStatus}>
              {syncStatus.online ? (
                <span style={styles.syncOnline}>
                  ● Online {syncStatus.lastSync && `(${formatTime(syncStatus.lastSync)})`}
                </span>
              ) : (
                <span style={styles.syncOffline}>● Offline</span>
              )}
            </div>
          )}
          <Auth />
          <button
            style={{ ...styles.mobileMenuButton }}
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
            <button
              style={styles.closeButton}
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div style={styles.menuContent}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                style={{
                  ...styles.menuItem,
                  ...(isActive(item.href) && item.href !== '#/admin' ? styles.menuItemActive : isActive(item.href) && item.href === '#/admin' && !navItems.slice(1).some(n => isActive(n.href)) ? styles.menuItemActive : {}),
                }}
              >
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
            <button onClick={onRefresh} style={styles.refreshButton}>
              Refresh
            </button>
            <button onClick={onDismissNotification} style={styles.dismissButton}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    height: '56px',
    transition: 'padding 300ms ease, height 300ms ease',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
  logo: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1e293b',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  nav: {
    display: 'none',
    gap: '4px',
    flexShrink: 0,
  },
  navLink: {
    padding: '6px 8px',
    textDecoration: 'none',
    color: '#64748b',
    fontWeight: '500',
    fontSize: '0.7rem',
    borderRadius: '6px',
    transition: 'all 150ms',
    whiteSpace: 'nowrap',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
  },
  navLinkActive: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  syncStatus: {
    fontSize: '0.65rem',
    fontWeight: '500',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  syncOnline: {
    color: '#10b981',
    fontWeight: '500',
  },
  syncOffline: {
    color: '#64748b',
    fontWeight: '500',
  },
  mobileMenuButton: {
    ...minTouchSize,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 150ms',
    borderRadius: '6px',
  },
  hamburgerLine: {
    width: '24px',
    height: '2px',
    backgroundColor: '#1e293b',
    borderRadius: '1px',
    transition: 'all 300ms ease',
  },
  hamburgerX: {
    fontSize: '1.5rem',
    color: '#1e293b',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 39,
    animation: 'fadeIn 300ms ease',
  },
  mobileMenuDrawer: {
    position: 'fixed',
    left: 0,
    top: '56px',
    height: 'calc(100vh - 56px)',
    width: '280px',
    backgroundColor: '#ffffff',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
    zIndex: 40,
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideIn 300ms ease',
  },
  menuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    gap: '12px',
  },
  menuTitle: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    width: '40px',
    height: '40px',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 150ms',
    borderRadius: '6px',
  },
  menuContent: {
    flex: 1,
    overflowY: 'auto',
    paddingTop: '8px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 150ms',
    borderLeft: '3px solid transparent',
  },
  menuItemActive: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    borderLeftColor: '#2563eb',
  },
  menuItemIcon: {
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
  },
  menuItemLabel: {
    flex: 1,
  },
  notification: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '12px 16px',
    backgroundColor: '#dbeafe',
    borderBottom: '1px solid #93c5fd',
    color: '#1e40af',
    fontSize: '0.75rem',
    gap: '12px',
  },
  notificationActions: {
    display: 'flex',
    gap: '8px',
    marginLeft: 'auto',
    width: '100%',
  },
  refreshButton: {
    ...minTouchSize,
    padding: '8px 12px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 150ms',
    flex: 1,
  },
  dismissButton: {
    ...minTouchSize,
    padding: '8px 12px',
    backgroundColor: 'transparent',
    color: '#1e40af',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 150ms',
    flex: 1,
  },
};

if (typeof document !== 'undefined') {
  const stylesStr = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
  `;

  if (!document.getElementById('admin-header-animations')) {
    const style = document.createElement('style');
    style.id = 'admin-header-animations';
    style.textContent = stylesStr;
    document.head.appendChild(style);
  }
}
