/**
 * settingsStyles.js
 * Style definitions for Settings component
 * Pure object exports - no React dependencies
 */

import { breakpoints, minTouchSize } from './responsiveStyles';

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
    padding: '16px',
    [`@media (min-width: ${breakpoints.tablet + 1}px)`]: {
      padding: '24px',
    },
    [`@media (min-width: ${breakpoints.laptop + 1}px)`]: {
      padding: '40px 28px',
    },
  },
  header: {
    marginBottom: '28px',
    [`@media (min-width: ${breakpoints.tablet + 1}px)`]: {
      marginBottom: '40px',
    },
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: colors.textDark,
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
    [`@media (min-width: ${breakpoints.tablet + 1}px)`]: {
      fontSize: '2rem',
    },
  },
  description: {
    fontSize: '0.875rem',
    color: colors.textLight,
    margin: 0,
    [`@media (min-width: ${breakpoints.tablet + 1}px)`]: {
      fontSize: '0.95rem',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
    fontSize: '0.75rem',
    color: colors.textMuted,
    fontWeight: 400,
    [`@media (min-width: ${breakpoints.tablet + 1}px)`]: {
      fontSize: '0.8125rem',
    },
  },
  input: {
    padding: '12px 16px',
    fontSize: '1rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: colors.white,
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    color: colors.textDark,
    minHeight: '44px',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: colors.primary,
    boxShadow: `0 0 0 4px rgba(37, 99, 235, 0.12)`,
    outline: 'none',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '16px',
    [`@media (min-width: ${breakpoints.tablet + 1}px)`]: {
      flexDirection: 'row',
      marginTop: '20px',
    },
  },
  button: {
    ...minTouchSize,
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
