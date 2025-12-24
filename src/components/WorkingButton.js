export default function WorkingButton({ label = 'Click Me', ...props }) {
  return (
    <button {...props} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>
      {label}
    </button>
  );
}