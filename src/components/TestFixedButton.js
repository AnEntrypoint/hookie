export default function TestFixedButton({ label = 'Fixed Button', ...props }) {
  return (
    <button {...props} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
      {label}
    </button>
  );
}