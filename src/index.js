import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalStyles from './GlobalStyles';
import AdminApp from './admin/AdminApp';
import App from './public/App';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={errorStyles.container}>
          <div style={errorStyles.content}>
            <h1 style={errorStyles.title}>Something went wrong</h1>
            <p style={errorStyles.message}>{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button onClick={this.handleReload} style={errorStyles.button}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const errorStyles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px' },
  content: { textAlign: 'center', maxWidth: '400px' },
  title: { fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '12px' },
  message: { fontSize: '1rem', color: '#64748b', marginBottom: '24px' },
  button: { padding: '12px 24px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '500', cursor: 'pointer' },
};

const isAdminRoute = window.location.pathname.includes('/admin') || window.location.hash.includes('admin');
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <GlobalStyles />
      {isAdminRoute ? <AdminApp /> : <App />}
    </ErrorBoundary>
  </React.StrictMode>
);

window.addEventListener('error', (event) => {
});

window.addEventListener('unhandledrejection', (event) => {
});
