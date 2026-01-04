import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);

    this.setState({
      hasError: true,
      error,
      errorInfo
    });

    if (this.props.onError) {
      this.props.onError(error, this.props.componentId);
    }
  }

  handleRemove = () => {
    if (this.props.onRemoveComponent) {
      this.props.onRemoveComponent(this.props.componentId);
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          padding: '24px',
          color: '#991b1b',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>⚠</span>
            Component Error
            {this.props.componentName && (
              <span style={{ fontSize: '14px', fontWeight: '400', opacity: '0.8' }}>
                [{this.props.componentName}]
              </span>
            )}
          </div>

          <div style={{
            fontSize: '14px',
            lineHeight: '1.5',
            marginBottom: '16px',
            backgroundColor: 'rgba(153, 27, 27, 0.05)',
            padding: '12px',
            borderRadius: '3px',
            fontFamily: 'monospace',
            overflowX: 'auto',
            wordBreak: 'break-word'
          }}>
            {this.state.error?.message || 'Unknown error'}
          </div>

          <div style={{
            fontSize: '13px',
            lineHeight: '1.6',
            marginBottom: '16px',
            opacity: '0.85'
          }}>
            This component failed to render. Check the props and component implementation, then try again.
          </div>

          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={this.handleRemove}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'background-color 150ms ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              Remove Component
            </button>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '8px 16px',
                backgroundColor: '#fecaca',
                color: '#991b1b',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'background-color 150ms ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#fca5a5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#fecaca'}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
