import { minTouchSize } from './responsiveStyles';

export const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', backgroundColor: 'var(--admin-bg)', borderBottom: '1px solid var(--admin-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '56px', transition: 'padding 300ms ease, height 300ms ease' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, overflow: 'hidden' },
  logo: { margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--admin-text)', whiteSpace: 'nowrap', flexShrink: 0 },
  nav: { display: 'none', gap: '2px', flexShrink: 0, backgroundColor: 'var(--admin-bg3)', borderRadius: '12px', padding: '4px' },
  navLink: { padding: '5px 14px', textDecoration: 'none', color: 'var(--admin-text2)', fontWeight: '500', fontSize: '0.875rem', borderRadius: '8px', transition: 'all 150ms', whiteSpace: 'nowrap', minHeight: '30px', display: 'flex', alignItems: 'center' },
  navLinkActive: { backgroundColor: 'var(--admin-bg)', color: 'var(--admin-accent)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  syncStatus: { fontSize: '0.65rem', fontWeight: '500', minHeight: '44px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' },
  syncOnline: { color: 'var(--admin-success)', fontWeight: '500' },
  syncOffline: { color: 'var(--admin-text2)', fontWeight: '500' },
  mobileMenuButton: { ...minTouchSize, padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'background-color 150ms', borderRadius: '10px' },
  hamburgerLine: { width: '24px', height: '2px', backgroundColor: 'var(--admin-text)', borderRadius: '1px', transition: 'all 300ms ease' },
  hamburgerX: { fontSize: '1.5rem', color: 'var(--admin-text)' },
  backdrop: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 39, animation: 'fadeIn 300ms ease' },
  mobileMenuDrawer: { position: 'fixed', left: 0, top: '56px', height: 'calc(100vh - 56px)', width: '280px', backgroundColor: 'var(--admin-bg)', boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)', zIndex: 40, display: 'flex', flexDirection: 'column', animation: 'slideIn 300ms ease' },
  menuHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--admin-border)', gap: '12px' },
  menuTitle: { margin: 0, fontSize: '1rem', fontWeight: '600', color: 'var(--admin-text)' },
  closeButton: { width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 'none', fontSize: '1.5rem', color: 'var(--admin-text2)', cursor: 'pointer', transition: 'all 150ms', borderRadius: '10px' },
  menuContent: { flex: 1, overflowY: 'auto', paddingTop: '8px' },
  menuItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: 'var(--admin-text2)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'all 150ms', borderLeft: '3px solid transparent' },
  menuItemActive: { backgroundColor: 'var(--admin-accent-light)', color: 'var(--admin-accent)', borderLeftColor: 'var(--admin-accent)' },
  menuItemIcon: { fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px' },
  menuItemLabel: { flex: 1 },
  notification: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '12px 16px', backgroundColor: 'var(--admin-accent-light)', borderBottom: '1px solid var(--admin-accent-border)', color: 'var(--admin-accent-dark)', fontSize: '0.75rem', gap: '12px' },
  notificationActions: { display: 'flex', gap: '8px', marginLeft: 'auto', width: '100%' },
  refreshButton: { ...minTouchSize, padding: '8px 12px', backgroundColor: 'var(--admin-accent)', color: 'var(--admin-bg)', border: 'none', borderRadius: '10px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '500', transition: 'background-color 150ms', flex: 1 },
  dismissButton: { ...minTouchSize, padding: '8px 12px', backgroundColor: 'transparent', color: 'var(--admin-accent-dark)', border: 'none', borderRadius: '10px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '500', transition: 'background-color 150ms', flex: 1 },
};

export const breadcrumbStyle = {
  display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px', color: 'var(--admin-text2)',
};

export const previewBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '4px',
  padding: '6px 14px', borderRadius: '10px',
  fontSize: '0.8125rem', fontWeight: 600, color: 'var(--admin-accent2)',
  textDecoration: 'none', border: '1px solid var(--admin-border)',
  backgroundColor: 'var(--admin-bg2)', cursor: 'pointer',
  transition: 'all 150ms', minHeight: '32px',
};

export const publishBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  padding: '6px 18px', borderRadius: '10px',
  fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-bg)',
  border: 'none', cursor: 'pointer',
  transition: 'all 150ms', minHeight: '32px', position: 'relative',
};

export const badgeStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minWidth: '18px', height: '18px', padding: '0 4px',
  backgroundColor: 'var(--admin-bg)', color: 'var(--admin-accent)',
  borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 800,
};

export const helpBtnStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: '32px', height: '32px', borderRadius: '50%',
  fontSize: '0.875rem', fontWeight: 700, color: 'var(--admin-text2)',
  border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-bg2)',
  cursor: 'pointer', transition: 'all 150ms',
};


export const themeBtnStyle = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: '32px', height: '32px', borderRadius: '50%',
  fontSize: '1rem', border: '1px solid var(--admin-border)',
  backgroundColor: 'var(--admin-bg2)', cursor: 'pointer', transition: 'all 150ms',
};

if (typeof document !== 'undefined') {
  const stylesStr = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  `;
  if (!document.getElementById('admin-header-animations')) {
    const style = document.createElement('style');
    style.id = 'admin-header-animations';
    style.textContent = stylesStr;
    document.head.appendChild(style);
  }
}
