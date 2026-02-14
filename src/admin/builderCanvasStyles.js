import { minTouchSize } from './responsiveStyles';

export const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc' },
  toolbar: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' },
  toolbarButton: { padding: '8px 12px', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', color: '#1e293b', ...minTouchSize },
  separator: { width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 8px' },
  select: { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.875rem', backgroundColor: '#ffffff', cursor: 'pointer', ...minTouchSize },
  canvas: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', justifyContent: 'center', transition: 'background-color 150ms' },
  canvasInner: { transition: 'width 300ms', minHeight: '400px' },
  emptyState: { padding: '48px 24px', textAlign: 'center', color: '#94a3b8', fontSize: '1rem', border: '2px dashed #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minHeight: '400px', justifyContent: 'center' },
  emptyArrow: { fontSize: '2rem', color: '#cbd5e1', fontFamily: 'monospace', letterSpacing: '4px', alignSelf: 'flex-start', marginLeft: '24px' },
  emptyIcon: { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700' },
  emptyHeading: { margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' },
  emptyText: { margin: 0, fontSize: '0.875rem', color: '#64748b', maxWidth: '320px', lineHeight: '1.5' },
  quickAddRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' },
  quickAddButton: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px 16px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 150ms', minWidth: '80px' },
  quickAddIcon: { fontSize: '0.875rem', fontWeight: '700', color: '#2563eb', fontFamily: 'monospace' },
  quickAddLabel: { fontSize: '0.75rem', color: '#64748b', fontWeight: '500' },
  selectionInfo: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#dbeafe', borderTop: '1px solid #93c5fd', gap: '12px' },
  selectionText: { fontSize: '0.875rem', color: '#1e40af', fontWeight: '500' },
  clearButton: { padding: '6px 12px', backgroundColor: 'transparent', border: 'none', color: '#1e40af', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', ...minTouchSize },
};
