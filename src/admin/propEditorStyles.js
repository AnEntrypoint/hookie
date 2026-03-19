export const getMobileContainerStyle = () => ({
  padding: '16px',
  marginBottom: '16px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
});

export const getDesktopContainerStyle = () => ({
  padding: '16px',
  marginBottom: '12px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
});

export const getMobileRowStyle = () => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '16px',
  alignItems: 'stretch',
});

export const getDesktopRowStyle = () => ({
  display: 'flex',
  gap: '12px',
  marginBottom: '8px',
  alignItems: 'flex-end',
  flexWrap: 'wrap',
});

export const getFieldStyle = (isMobile) => ({
  flex: isMobile ? 'none' : '1',
  display: 'flex',
  flexDirection: 'column',
  width: isMobile ? '100%' : 'auto',
});

export const getMobileCheckboxFieldStyle = () => ({
  display: 'flex',
  alignItems: 'center',
  paddingBottom: '0',
  minHeight: '44px',
});

export const getDesktopCheckboxFieldStyle = () => ({
  display: 'flex',
  alignItems: 'center',
  paddingBottom: '8px',
});

export const getLabelStyle = (isMobile) => ({
  fontSize: isMobile ? '16px' : '0.875rem',
  fontWeight: '600',
  color: '#64748b',
  marginBottom: isMobile ? '8px' : '4px',
  lineHeight: '1.4',
});

export const getCheckboxLabelStyle = (isMobile) => ({
  fontSize: isMobile ? '16px' : '0.875rem',
  fontWeight: '600',
  color: '#64748b',
  display: 'flex',
  alignItems: 'center',
  gap: isMobile ? '12px' : '6px',
  cursor: 'pointer',
  userSelect: 'none',
});

export const getInputStyle = (isMobile) => ({
  padding: isMobile ? '12px' : '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  fontSize: isMobile ? '16px' : '0.875rem',
  transition: 'border 150ms ease-in-out',
  minHeight: isMobile ? '44px' : 'auto',
  lineHeight: isMobile ? '1.5' : 'inherit',
});

export const getSelectStyle = (isMobile) => ({
  padding: isMobile ? '12px' : '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  fontSize: isMobile ? '16px' : '0.875rem',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  minHeight: isMobile ? '44px' : 'auto',
  lineHeight: isMobile ? '1.5' : 'inherit',
});

export const getCheckboxStyle = (isMobile) => ({
  width: isMobile ? '24px' : '16px',
  height: isMobile ? '24px' : '16px',
  cursor: 'pointer',
  minWidth: isMobile ? '24px' : '16px',
});

export const getRemoveButtonStyle = (isMobile) => ({
  padding: isMobile ? '12px 16px' : '8px 16px',
  backgroundColor: 'transparent',
  color: '#ef4444',
  border: '1px solid #fecaca',
  borderRadius: '6px',
  fontSize: isMobile ? '16px' : '0.875rem',
  cursor: 'pointer',
  transition: 'all 150ms ease-in-out',
  minHeight: isMobile ? '44px' : 'auto',
  fontWeight: '600',
  lineHeight: '1.4',
});
