export const styles = {
  builder: { display: 'flex', height: '100vh', backgroundColor: '#f8fafc' },
  left: { width: '20%', minWidth: '250px', borderRight: '1px solid #e2e8f0', padding: '16px', backgroundColor: '#ffffff', overflowY: 'auto', transition: 'width 300ms ease-in-out' },
  leftMobile: { display: 'none' },
  leftTablet: { width: '200px', minWidth: 'unset', padding: '12px' },
  center: { flex: '1', display: 'flex', flexDirection: 'column', transition: 'flex 300ms ease-in-out' },
  right: { width: '25%', minWidth: '300px', borderLeft: '1px solid #e2e8f0', padding: '16px', backgroundColor: '#ffffff', overflowY: 'auto' },
  rightMobile: { display: 'none' },
  rightTablet: { width: '100%', minWidth: 'unset', borderLeft: 'none', borderTop: '1px solid #e2e8f0', height: 'auto', maxHeight: '200px', padding: '12px' },
  placeholder: { padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' },
};
