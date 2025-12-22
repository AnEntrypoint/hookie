/**
 * settingsStyles.js
 * Style definitions for Settings component
 * Pure object exports - no React dependencies
 */

const colors = {
  textDark: '#1e293b',
  textLight: '#64748b',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  white: '#ffffff',
  primary: '#2563eb',
  primaryDark: '#1e40af',
  danger: '#ef4444',
  success: '#10b981',
  background: '#f8fafc',
  errorBg: '#fee2e2',
  errorBorder: '#ef4444',
  errorText: '#7f1d1d',
  successBg: '#dcfce7',
  successBorder: '#10b981',
  successText: '#166534',
};

export const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '40px 28px',
  },
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    color: colors.textDark,
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  description: {
    fontSize: '0.95rem',
    color: colors.textLight,
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: colors.textDark,
  },
  labelHelper: {
    fontSize: '0.8125rem',
    color: colors.textMuted,
    fontWeight: 400,
  },
  input: {
    padding: '12px 16px',
    fontSize: '0.95rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: colors.white,
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    color: colors.textDark,
  },
  inputFocus: {
    borderColor: colors.primary,
    boxShadow: `0 0 0 4px rgba(37, 99, 235, 0.12)`,
    outline: 'none',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  button: {
    flex: 1,
    padding: '12px 20px',
    fontSize: '0.95rem',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    color: colors.white,
  },
  primaryButtonHover: {
    backgroundColor: colors.primaryDark,
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
  },
  secondaryButton: {
    backgroundColor: colors.background,
    color: colors.textLight,
    border: `1px solid ${colors.border}`,
  },
  secondaryButtonHover: {
    backgroundColor: colors.border,
  },
  errorAlert: {
    backgroundColor: colors.errorBg,
    border: `2px solid ${colors.errorBorder}`,
    borderRadius: '8px',
    padding: '12px 16px',
    color: colors.errorText,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  successAlert: {
    backgroundColor: colors.successBg,
    border: `2px solid ${colors.successBorder}`,
    borderRadius: '8px',
    padding: '12px 16px',
    color: colors.successText,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};

export { colors };
