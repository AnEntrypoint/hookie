export default function RenderTestButton({ label = 'Render Test', ...props }) {
  return React.createElement(
    'button',
    { ...props, style: { padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px' } },
    label
  );
}