export default function TestCreateElement({ children, ...props }) {
  return React.createElement(
    'button',
    { ...props, style: { padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' } },
    children || 'Click Me'
  );
}