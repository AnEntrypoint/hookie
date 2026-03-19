import { DEFAULT_COLORS } from './propsEditorHelpers';

export const getMobileWrapperStyle = () => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 999,
});

export const getMobileContainerStyle = () => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '16px',
  maxHeight: 'calc(100vh - 60px)',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  marginTop: 'auto',
  backgroundColor: '#fff',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  maxWidth: '100vw',
});

export const getDesktopContainerStyle = () => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '0',
});

export const getMobileHeaderStyle = () => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '16px',
  borderBottom: `1px solid ${DEFAULT_COLORS.border}`,
  position: 'sticky',
  top: 0,
  backgroundColor: '#fff',
  zIndex: 10,
  marginLeft: '-16px',
  marginRight: '-16px',
  paddingLeft: '16px',
  paddingRight: '16px',
  marginBottom: '8px',
});

export const getCloseButtonStyle = () => ({
  background: 'none',
  border: 'none',
  fontSize: '24px',
  color: DEFAULT_COLORS.textMuted,
  cursor: 'pointer',
  padding: '4px 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '44px',
  minHeight: '44px',
  borderRadius: '4px',
  transition: 'background-color 0.2s ease',
});

export const getFieldWrapperStyle = (index, total) => ({
  paddingBottom: '24px',
  borderBottom: index < total - 1 ? `1px solid ${DEFAULT_COLORS.border}` : 'none',
});

export const getEmptyStateStyle = (isMobile) => ({
  padding: isMobile ? '24px 16px' : '24px',
  textAlign: 'center',
  color: DEFAULT_COLORS.textMuted,
  fontSize: isMobile ? '16px' : '14px',
});
