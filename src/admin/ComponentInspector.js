import { useState } from 'react'

export default function ComponentInspector({
  pageData,
  selectedComponentId,
  onSelectComponent
}) {
  const [expanded, setExpanded] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [showDetails, setShowDetails] = useState(null)

  const toggleExpanded = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const renderComponentNode = (component, depth = 0) => {
    const isExpanded = expanded[component.id]
    const isSelected = selectedComponentId === component.id
    const hasChildren = component.children && component.children.length > 0
    const matches = !searchTerm ||
      component.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.id.includes(searchTerm)

    if (!matches) return null

    return (
      <div key={component.id} style={styles.treeNode}>
        <div
          style={{
            ...styles.nodeLabel,
            paddingLeft: depth * 20,
            backgroundColor: isSelected ? '#dbeafe' : 'transparent',
            borderLeft: isSelected ? '3px solid #3b82f6' : 'none'
          }}
          onClick={() => onSelectComponent(component.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(component.id)
              }}
              style={styles.expandButton}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}

          <span style={styles.componentType}>
            {component.type}
          </span>

          <span style={styles.componentId}>
            #{component.id}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowDetails(
                showDetails === component.id ? null : component.id
              )
            }}
            style={styles.infoButton}
          >
            ℹ️
          </button>
        </div>

        {isExpanded && hasChildren && (
          <div style={styles.childrenContainer}>
            {component.children.map(child =>
              renderComponentNode(child, depth + 1)
            )}
          </div>
        )}

        {showDetails === component.id && (
          <ComponentDetails component={component} />
        )}
      </div>
    )
  }

  return (
    <div style={styles.inspector}>
      <h3 style={styles.heading}>Component Inspector</h3>

      <input
        type="text"
        placeholder="Search components..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      <div style={styles.tree}>
        {pageData?.components?.map(comp =>
          renderComponentNode(comp)
        )}
      </div>
    </div>
  )
}

function ComponentDetails({ component }) {
  return (
    <div style={styles.details}>
      <h4 style={styles.detailsHeading}>Props:</h4>
      <pre style={styles.code}>
        {JSON.stringify(component.props, null, 2)}
      </pre>

      <h4 style={styles.detailsHeading}>Style:</h4>
      <pre style={styles.code}>
        {JSON.stringify(component.style, null, 2)}
      </pre>

      <h4 style={styles.detailsHeading}>
        Children: {component.children?.length || 0}
      </h4>
    </div>
  )
}

const styles = {
  inspector: {
    padding: '12px',
    borderLeft: '1px solid #e2e8f0',
    maxWidth: '300px',
    overflowY: 'auto',
    maxHeight: '500px',
    backgroundColor: '#f8fafc'
  },
  heading: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1e293b'
  },
  searchInput: {
    width: '100%',
    padding: '8px',
    marginBottom: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  tree: {
    fontFamily: 'monospace',
    fontSize: '12px'
  },
  treeNode: {
    marginBottom: '4px'
  },
  nodeLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  expandButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0 4px',
    width: '20px',
    fontSize: '10px',
    color: '#64748b'
  },
  componentType: {
    fontWeight: 'bold',
    color: '#7c3aed'
  },
  componentId: {
    color: '#64748b',
    fontSize: '11px'
  },
  infoButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: 'auto'
  },
  childrenContainer: {
    borderLeft: '2px solid #e2e8f0',
    paddingLeft: '4px'
  },
  details: {
    backgroundColor: '#f1f5f9',
    padding: '8px',
    borderRadius: '4px',
    marginTop: '4px',
    marginLeft: '20px'
  },
  detailsHeading: {
    margin: '0 0 6px 0',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#475569'
  },
  code: {
    fontSize: '11px',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    padding: '6px',
    borderRadius: '4px',
    overflow: 'auto',
    maxHeight: '200px',
    margin: '0 0 8px 0',
    fontFamily: 'monospace'
  }
}
