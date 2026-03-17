import React, { useState, useEffect } from 'react';
import componentRegistry from '../lib/componentRegistry.js';
import * as github from '../lib/github.js';
import { listComponentSchemas, deleteComponentSchema } from '../lib/componentManager.js';
import { styles } from './componentLibraryStyles.js';
import ComponentLibraryList from './ComponentLibraryList.js';
import ComponentLibraryDetail from './ComponentLibraryDetail.js';
import './componentLibraryStyles.css';

export default function ComponentLibrary({ owner, repo }) {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [previewProps, setPreviewProps] = useState({});
  const [pageUsage, setPageUsage] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { loadComponents(); }, [owner, repo]);
  useEffect(() => { if (selectedComponent) setPreviewProps({}); }, [selectedComponent]);

  const loadComponents = async () => {
    try {
      setLoading(true);
      const allNames = componentRegistry.getAllComponents();
      const customNames = await listComponentSchemas(owner, repo);
      const componentList = allNames.map(name => {
        const schema = componentRegistry.getComponent(name);
        return { name, ...schema, isCustom: customNames.includes(name), isBuiltIn: !customNames.includes(name) };
      });
      setComponents(componentList);

      const usage = {};
      const pages = await github.getRepoStructure(owner, repo);
      const pageFiles = (pages['content/pages'] || []).filter(f => f.name.endsWith('.json'));
      for (const pageFile of pageFiles) {
        const pageName = pageFile.name.replace('.json', '');
        const pageContent = await github.readFile(owner, repo, `content/pages/${pageFile.name}`);
        const pageData = JSON.parse(pageContent.content);
        const usedTypes = new Set();
        const traverse = (items) => (items || []).forEach(c => { usedTypes.add(c.type); traverse(c.children); });
        traverse(pageData.components);
        usedTypes.forEach(type => { if (!usage[type]) usage[type] = []; usage[type].push(pageName); });
      }
      setPageUsage(usage);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComponent = async (componentName) => {
    try {
      await deleteComponentSchema(owner, repo, componentName, `Delete component: ${componentName}`);
      try {
        const fileInfo = await github.readFile(owner, repo, `src/components/${componentName}.js`);
        await github.deleteFile(owner, repo, `src/components/${componentName}.js`, `Delete component: ${componentName}`, fileInfo.sha);
      } catch {}
      setComponents(prev => prev.filter(c => c.name !== componentName));
      setSelectedComponent(null);
      setPageUsage(prev => { const u = { ...prev }; delete u[componentName]; return u; });
    } catch {}
    setDeleteConfirm(null);
  };

  const handlePropChange = (propName, propSchema) => (value) => {
    const coerce = (val, type) => {
      if (type === 'number') return isNaN(val) ? val : Number(val);
      if (type === 'boolean') return val === true || val === 'true';
      if (type === 'array' && typeof val === 'string') { try { return JSON.parse(val); } catch { return []; } }
      if (type === 'object' && typeof val === 'string') { try { return JSON.parse(val); } catch { return {}; } }
      return val;
    };
    setPreviewProps(prev => ({ ...prev, [propName]: coerce(value, propSchema?.type) }));
  };

  const handleSelectComponent = (comp) => {
    setSelectedComponent(comp);
    if (isMobile) setShowDetail(true);
  };

  const filteredComponents = components.filter(comp => {
    const matchSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterType === 'all' || (filterType === 'custom' && comp.isCustom) || (filterType === 'builtin' && comp.isBuiltIn);
    return matchSearch && matchFilter;
  });

  if (loading) return <div style={styles.loading}>Loading components...</div>;

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>
        {(!isMobile || !showDetail) && (
          <div style={{ width: isMobile ? '100%' : '300px', borderRight: isMobile ? 'none' : '1px solid #e2e8f0', flexShrink: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <ComponentLibraryList
              components={filteredComponents}
              selectedComponent={selectedComponent}
              onSelect={handleSelectComponent}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterType={filterType}
              onFilterChange={setFilterType}
              isMobile={isMobile}
            />
          </div>
        )}
        {(!isMobile || showDetail) && (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <ComponentLibraryDetail
              component={selectedComponent}
              pageUsage={pageUsage}
              previewProps={previewProps}
              onPropChange={handlePropChange}
              onDelete={handleDeleteComponent}
              deleteConfirm={deleteConfirm}
              onDeleteConfirm={setDeleteConfirm}
              onDeleteCancel={() => setDeleteConfirm(null)}
              isMobile={isMobile}
              onBack={() => setShowDetail(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
