import React from 'react';
import { colors, typography, spacing } from './theme';

export default function GlobalStyles() {
  return (
    <style>{`
      :root {
        --color-primary: ${colors.primary};
        --color-primary-dark: ${colors.primaryDark};
        --color-primary-light: ${colors.primaryLight};
        --color-accent: ${colors.accent};
        --color-success: ${colors.success};
        --color-danger: ${colors.danger};
        --color-text-dark: ${colors.textDark};
        --color-text-light: ${colors.textLight};
        --color-bg-light: ${colors.lightBg};
        --color-border: ${colors.border};
        --spacing-xs: ${spacing.xs};
        --spacing-sm: ${spacing.sm};
        --spacing-md: ${spacing.md};
        --spacing-base: ${spacing.base};
        --spacing-lg: ${spacing.lg};
        --spacing-xl: ${spacing.xl};
        --spacing-2xl: ${spacing['2xl']};
        --spacing-3xl: ${spacing['3xl']};
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html, body {
        margin: 0;
        padding: 0;
        font-family: ${typography.fontFamily};
        font-size: ${typography.body.size};
        line-height: ${typography.body.lineHeight};
        color: ${colors.textDark};
        background-color: ${colors.lightBg};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      #root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      h1, h2, h3, h4, h5, h6 {
        margin: 0;
        font-weight: ${typography.h1.weight};
        line-height: 1.2;
      }

      h1 {
        font-size: ${typography.h1.size};
        letter-spacing: ${typography.h1.letterSpacing};
      }

      h2 {
        font-size: ${typography.h2.size};
        letter-spacing: ${typography.h2.letterSpacing};
      }

      h3 {
        font-size: ${typography.h3.size};
        letter-spacing: ${typography.h3.letterSpacing};
      }

      h4 {
        font-size: ${typography.h4.size};
      }

      p {
        margin: 0;
      }

      a {
        color: ${colors.primary};
        text-decoration: none;
        transition: color 150ms ease-in-out;
      }

      a:hover {
        color: ${colors.primaryDark};
        text-decoration: underline;
      }

      button {
        font-family: inherit;
        cursor: pointer;
        transition: all 150ms ease-in-out;
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      input, textarea, select {
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
      }

      input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: ${colors.primary};
        box-shadow: 0 0 0 4px ${colors.primaryLight};
      }

      code {
        font-family: ${typography.monospace};
        background-color: ${colors.subtleBg};
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.875em;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .auth-logout {
        min-width: 44px;
        min-height: 44px;
        padding: 8px 12px;
        background-color: #ef4444;
        color: #ffffff;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        font-size: 0.875rem;
      }

      .auth-logout:hover {
        background-color: #dc2626;
      }

      .auth-login {
        min-width: 44px;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 16px;
        background-color: ${colors.primary};
        color: #ffffff;
        border-radius: 6px;
        font-weight: 500;
      }

      .auth-login:hover {
        background-color: ${colors.primaryDark};
      }
    `}</style>
  );
}
