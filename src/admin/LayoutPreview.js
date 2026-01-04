import React from 'react';

export default function LayoutPreview({ layout }) {
  if (!layout) {
    return <div style={styles.loading}>Loading preview...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.previewLabel}>Live Preview</div>
      <div style={styles.preview}>
        {layout.header?.enabled && (
          <div
            style={{
              ...styles.header,
              backgroundColor: layout.header.backgroundColor,
              borderBottom: layout.header.borderBottom,
              height: `${layout.header.height}px`,
            }}
          >
            <div style={styles.headerContent}>
              <h3 style={styles.headerTitle}>{layout.site?.title || 'Site Title'}</h3>
            </div>
          </div>
        )}

        <div
          style={{
            ...styles.pageContent,
            backgroundColor: layout.colors?.background || '#ffffff',
            color: layout.colors?.text || '#1e293b',
          }}
        >
          <div style={styles.contentInner}>
            <div style={styles.contentBox}>
              <div
                style={{
                  ...styles.contentText,
                  fontSize: `${layout.typography?.fontSize?.base || 16}px`,
                  fontFamily: layout.typography?.fontFamily || 'system-ui, -apple-system, sans-serif',
                }}
              >
                <strong>Primary Color:</strong>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: layout.colors?.primary,
                    borderRadius: '4px',
                    marginTop: '8px',
                  }}
                />
              </div>
            </div>

            <div style={styles.contentBox}>
              <div
                style={{
                  ...styles.contentText,
                  fontSize: `${layout.typography?.fontSize?.base || 16}px`,
                  fontFamily: layout.typography?.fontFamily || 'system-ui, -apple-system, sans-serif',
                }}
              >
                <strong>Secondary Color:</strong>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: layout.colors?.secondary,
                    borderRadius: '4px',
                    marginTop: '8px',
                  }}
                />
              </div>
            </div>

            <div style={styles.contentBox}>
              <div style={styles.contentText}>
                <strong>Typography:</strong>
                <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                  Font: {layout.typography?.fontFamily || 'system-ui'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {layout.footer?.enabled && (
          <div
            style={{
              ...styles.footer,
              backgroundColor: layout.footer.backgroundColor,
              borderTop: layout.footer.borderTop,
              height: `${layout.footer.height}px`,
            }}
          >
            <div style={styles.footerContent}>
              <small>{layout.footer.content || 'Footer content'}</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '24px',
  },
  previewLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  preview: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
    transition: 'all 150ms ease',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
  },
  pageContent: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  contentInner: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  },
  contentBox: {
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  contentText: {
    margin: 0,
    fontSize: '13px',
    lineHeight: '1.5',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
    transition: 'all 150ms ease',
  },
  footerContent: {
    fontSize: '12px',
    color: '#64748b',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#64748b',
    fontSize: '14px',
  },
};
