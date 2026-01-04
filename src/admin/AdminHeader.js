import React from 'react';
import Auth from './Auth';

export default function AdminHeader({ 
  currentRoute, 
  syncStatus, 
  showNotification, 
  onRefresh, 
  onDismissNotification 
}) {
  const isActive = (route) => currentRoute && currentRoute.startsWith(route);

  return (
    <>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>CMS Admin</h1>
          <nav style={styles.nav}>
            <a
              href="#/admin"
              style={{
                ...styles.navLink,
                ...(isActive('/admin') && !isActive('/admin/pages') && !isActive('/admin/components') && !isActive('/admin/library') && !isActive('/admin/settings') ? styles.navLinkActive : {})
              }}
            >
              Pages
            </a>
            <a
              href="#/admin/components"
              style={{
                ...styles.navLink,
                ...(isActive('/admin/components') ? styles.navLinkActive : {})
              }}
            >
              Components
            </a>
            <a
              href="#/admin/library"
              style={{
                ...styles.navLink,
                ...(isActive('/admin/library') ? styles.navLinkActive : {})
              }}
            >
              Library
            </a>
            <a
              href="#/admin/settings"
              style={{
                ...styles.navLink,
                ...(isActive('/admin/settings') ? styles.navLinkActive : {})
              }}
            >
              Settings
            </a>
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
        </div>
      </header>

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
    padding: '16px 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
  },
  nav: {
    display: 'flex',
    gap: '8px',
  },
  navLink: {
    padding: '8px 16px',
    textDecoration: 'none',
    color: '#64748b',
    fontWeight: '500',
    fontSize: '0.875rem',
    borderRadius: '6px',
    transition: 'all 150ms',
  },
  navLinkActive: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  syncStatus: {
    fontSize: '0.875rem',
  },
  syncOnline: {
    color: '#10b981',
    fontWeight: '500',
  },
  syncOffline: {
    color: '#64748b',
    fontWeight: '500',
  },
  notification: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#dbeafe',
    borderBottom: '1px solid #93c5fd',
    color: '#1e40af',
    fontSize: '0.875rem',
  },
  notificationActions: {
    display: 'flex',
    gap: '8px',
  },
  refreshButton: {
    padding: '6px 12px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  dismissButton: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    color: '#1e40af',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
};
