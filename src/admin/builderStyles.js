export const styles = {
  builder: { display: 'flex', height: '100vh', backgroundColor: '#f1f5f9', gap: '8px', padding: '8px' },
  left: { width: '20%', minWidth: '250px', borderRadius: '16px', padding: '16px', backgroundColor: '#ffffff', overflowY: 'auto', transition: 'width 300ms ease-in-out', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  leftMobile: { display: 'none' },
  leftTablet: { width: '200px', minWidth: 'unset', padding: '12px', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  center: { flex: '1', display: 'flex', flexDirection: 'column', transition: 'flex 300ms ease-in-out', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  right: { width: '25%', minWidth: '300px', borderRadius: '16px', padding: '16px', backgroundColor: '#ffffff', overflowY: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  rightMobile: { display: 'none' },
  rightTablet: { width: '100%', minWidth: 'unset', borderRadius: '16px', height: 'auto', maxHeight: '200px', padding: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  placeholder: { padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '12px', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' },
};
