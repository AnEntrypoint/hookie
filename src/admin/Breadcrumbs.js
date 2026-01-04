import React from 'react';
import { navigateTo } from './Router';
import { colors, spacing, typography } from '../theme';

export default function Breadcrumbs({ currentRoute, currentPageName }) {
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: 'Home', route: '/admin' }];

    if (!currentRoute || currentRoute === '/admin' || currentRoute === '') {
      return breadcrumbs;
    }

    if (currentRoute === '/admin/pages' || currentRoute === '/admin') {
      return breadcrumbs;
    }

    if (currentRoute === '/admin/pages/:pageName') {
      breadcrumbs.push({ label: 'Pages', route: '/admin' });
      if (currentPageName) {
        const displayName = formatPageName(currentPageName);
        breadcrumbs.push({ label: displayName, route: null, isCurrent: true });
      }
      return breadcrumbs;
    }

    if (currentRoute === '/admin/components') {
      breadcrumbs.push({ label: 'Components', route: null, isCurrent: true });
      return breadcrumbs;
    }

    if (currentRoute.includes('/admin/components')) {
      breadcrumbs.push({ label: 'Components', route: '/admin/components' });
      breadcrumbs.push({ label: 'Create', route: null, isCurrent: true });
      return breadcrumbs;
    }

    if (currentRoute === '/admin/settings') {
      breadcrumbs.push({ label: 'Settings', route: null, isCurrent: true });
      return breadcrumbs;
    }

    return breadcrumbs;
  };

  const formatPageName = (pageName) => {
    if (!pageName) return '';
    if (pageName.length > 30) {
      return pageName.substring(0, 27) + '...';
    }
    return pageName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div style={styles.breadcrumbBar}>
      <div style={styles.breadcrumbContainer}>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span style={styles.separator}> / </span>}
            {crumb.isCurrent ? (
              <span style={styles.currentCrumb}>{crumb.label}</span>
            ) : (
              <a
                href={`#${crumb.route}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(crumb.route);
                }}
                style={styles.breadcrumbLink}
              >
                {crumb.label}
              </a>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const styles = {
  breadcrumbBar: {
    padding: `${spacing.md} ${spacing.xl}`,
    backgroundColor: colors.lightBg,
    borderBottom: `1px solid ${colors.border}`,
  },
  breadcrumbContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: typography.small.size,
    fontWeight: typography.small.weight,
  },
  breadcrumbLink: {
    color: colors.primary,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: `color 150ms`,
    ':hover': {
      color: '#1e40af',
    },
  },
  currentCrumb: {
    color: colors.textLight,
    cursor: 'default',
  },
  separator: {
    color: colors.textLight,
    margin: `0 ${spacing.xs}`,
  },
};
