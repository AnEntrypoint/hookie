import { useState } from 'react'
import { styles } from './componentInspectorStyles'

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
