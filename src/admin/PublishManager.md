# PublishManager Component

Beautiful git publishing interface with real-time change tracking and elegant commit workflow.

## Purpose
Manages publishing changes to GitHub. Shows organized diff of changes, allows commit message input, and handles the commit/push process with visual feedback.

## Component Type
React functional component with async operations

## Dependencies
- github.md for git operations
- Global design system from index.md

## Props
- `owner` (string): GitHub repository owner
- `repo` (string): Repository name
- `changes` (array): List of changed files
  - Each change: { path, status, diff, content }

## Design Specifications

### Layout
- Container: Full width, max-width 1200px, centered
- Padding: 40px (improved spacing)
- Background: White (#ffffff)
- Border-radius: 12px
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05)

### Changes Section
- Title: "Changed Files" (1.875rem, weight 800, #1e293b, letter-spacing -0.4px)
- Padding: 32px
- Border: 1px solid #e2e8f0 with subtle shadow
- Border-radius: 12px
- Margin-bottom: 32px (improved spacing)
- Background: linear gradient from #ffffff to #f8fafc (modern gradient)
- Box-shadow: 0 2px 8px rgba(0,0,0,0.06)
- Text-shadow: 0 1px 2px rgba(0,0,0,0.05)

### Change Item
- Display: flex flex-direction column
- Padding: 20px (improved spacing)
- Border: 2px solid transparent
- Border-radius: 12px
- Background: #f8fafc
- Margin-bottom: 16px (improved spacing)
- Hover: background #f1f5f9, border-color #2563eb, transform translateY(-2px)
- Active: border-color #1e40af
- Transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Box-shadow: 0 1px 3px rgba(0,0,0,0.05) on hover

#### Status Badge
- Styling varies by status:
  - **Added**: background #dcfce7 (green-100), color #166534 (green-900)
  - **Modified**: background #fef08a (yellow-100), color #854d0e (amber-900)
  - **Deleted**: background #fee2e2 (red-100), color #991b1b (red-900)
- Padding: 4px 12px
- Border-radius: 4px
- Font-size: 0.75rem
- Font-weight: 600
- Display: inline-block
- Margin-right: 12px

#### Path
- Font-family: monospace
- Font-size: 0.875rem
- Color: #1e293b
- Word-break: break-all
- Margin-left: 12px

## State Management
Use React useState for:
- `commitMessage` (string): User's commit message
- `publishing` (boolean): Publishing in progress
- `lastCommit` (object|null): Result of last commit
- `error` (string|null): Error message
- `expandedDiffs` (Set): Tracking which diffs are expanded

## Rendering Logic

### No Changes State
- Container: Centered, min-height 200px, flex center
- Icon: Checkmark circle, #10b981, 64px
- Title: "All changes published" (1.5rem, #1e293b)
- Subtitle: "No pending changes. Keep building!" (1rem, #64748b)

### Changes List
- Display each file with status badge and path
- Diffs expandable (collapsible details)
- Green highlight for additions
- Red highlight for deletions
- Dark background for code blocks

### Commit Form
- Textarea styling:
  - Min-height: 120px
  - Padding: 12px
  - Font-family: monospace
  - Font-size: 0.875rem
  - Border: 1px solid #e2e8f0
  - Border-radius: 8px
  - Resize: vertical
  - Focus: border #2563eb, box-shadow blue-500 light
- Character counter: bottom-right, #64748b, 0.75rem
- Warning message: #f59e0b, displays when < 10 characters
- Publish button: Primary blue, full-width or inline
- Disabled state: When publishing or message < 10 chars

### Success State
- Background: #ecfdf5 (green-50)
- Border: 2px solid #10b981
- Border-radius: 12px
- Padding: 24px
- Icon: Checkmark, #10b981
- Title: "Published Successfully" (1.25rem, #065f46)
- Commit info displayed with GitHub link
- Auto-reset after 5 seconds

### Diff Display
- Display each changed file with status badge
- Expandable/collapsible diff sections
- Code blocks with monospace font
- Syntax highlighting for additions (green) and deletions (red)
- Dark background (#1e293b) for code blocks
- Padding: 12px inside code blocks
- Border-radius: 4px on code blocks

### Textarea Styling
- Min-height: 120px
- Padding: 12px
- Font-family: monospace
- Font-size: 0.875rem
- Border: 1px solid #e2e8f0
- Border-radius: 8px
- Resize: vertical
- Focus: border #2563eb, box-shadow inset with light blue
- Background: #ffffff
- Color: #1e293b

## DOM Structure
```jsx
<div style={styles.container}>
  <h2 style={styles.title}>Publish Changes</h2>

  {changes.length === 0 ? (
    <div style={styles.emptyState}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <h3 style={styles.emptyTitle}>All changes published</h3>
      <p style={styles.emptySubtitle}>No pending changes. Keep building!</p>
    </div>
  ) : (
    <>
      <div style={styles.changesSection}>
        <h3 style={styles.sectionTitle}>Changed Files ({changes.length})</h3>

        {changes.map((change, index) => (
          <div key={index} style={styles.changeItem}>
            <div style={styles.changeHeader}>
              <span style={getStatusBadgeStyle(change.status)}>
                {change.status.toUpperCase()}
              </span>
              <code style={styles.changePath}>{change.path}</code>
            </div>

            {change.diff && (
              <details style={styles.diffDetails}>
                <summary style={styles.diffSummary}>View diff</summary>
                <pre style={styles.diffCode}>{change.diff}</pre>
              </details>
            )}
          </div>
        ))}
      </div>

      <div style={styles.commitSection}>
        <h3 style={styles.sectionTitle}>Commit Message</h3>

        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Describe your changes..."
          style={styles.textarea}
        />

        <div style={styles.commitInfo}>
          <span style={styles.charCount}>
            {commitMessage.length} characters
          </span>
          {commitMessage.length < 10 && (
            <span style={styles.warning}>
              Commit message should be descriptive (at least 10 characters)
            </span>
          )}
        </div>

        {error && (
          <div style={styles.errorMessage}>{error}</div>
        )}

        <button
          style={styles.publishButton}
          onClick={handlePublish}
          disabled={publishing || !commitMessage.trim() || commitMessage.length < 10}
        >
          {publishing ? 'Publishing...' : 'Publish to GitHub'}
        </button>
      </div>
    </>
  )}

  {lastCommit && (
    <div style={styles.successState}>
      <div style={styles.successIcon}>✓</div>
      <h3 style={styles.successTitle}>Published Successfully</h3>
      <div style={styles.commitInfo}>
        <div>
          <strong>Commit:</strong>{' '}
          <a href={`https://github.com/${owner}/${repo}/commit/${lastCommit.sha}`} target="_blank" rel="noopener noreferrer">
            {lastCommit.sha.substring(0, 7)}
          </a>
        </div>
        <div>
          <strong>Message:</strong> {lastCommit.message}
        </div>
        <div style={styles.commitMeta}>
          <span>{lastCommit.author}</span>
          <span>{new Date(lastCommit.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )}
</div>
```

### Status Badge Styles
```javascript
const getStatusBadgeStyle = (status) => {
  const baseStyle = {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
    marginRight: '12px'
  };

  const statusStyles = {
    added: { background: '#dcfce7', color: '#166534' },
    modified: { background: '#fef08a', color: '#854d0e' },
    deleted: { background: '#fee2e2', color: '#991b1b' }
  };

  return { ...baseStyle, ...statusStyles[status] };
};
```

## Default Export
Export the PublishManager component as default export.

## Implementation Notes
- Validate commit message before allowing publish
- Show progress indicator during publish
- Handle API rate limits gracefully
- Provide link to view commit on GitHub
- Clear form after successful publish
- Show success notification with auto-reset
- Handle errors with helpful messages
- Support keyboard navigation
- Ensure proper contrast ratios
- Disable button when conditions not met

## Event Handlers

### handlePublish()
```
async () => {
  if (!commitMessage.trim()) {
    setError('Commit message is required');
    return;
  }

  if (commitMessage.length < 10) {
    setError('Commit message should be at least 10 characters');
    return;
  }

  setPublishing(true);
  setError(null);

  try {
    // For each changed file, commit it
    // In practice, this might batch commits or use a tree API
    const commitResults = [];

    for (const change of changes) {
      if (change.status === 'deleted') {
        // Delete file
        await github.deleteFile(owner, repo, change.path, commitMessage);
      } else {
        // Write file
        await github.writeFile(owner, repo, change.path, change.content, commitMessage);
      }

      commitResults.push({
        path: change.path,
        status: change.status
      });
    }

    // Get latest commit info
    const branchInfo = await github.getBranchInfo(owner, repo, 'main');
    const latestCommit = branchInfo.commit;

    setLastCommit({
      sha: latestCommit.sha,
      message: commitMessage,
      author: latestCommit.commit.author.name,
      timestamp: latestCommit.commit.author.date
    });

    // Clear commit message
    setCommitMessage('');

    // Notify parent (optional)
    // onPublishSuccess?.();
  } catch (err) {
    setError(err.message);
  } finally {
    setPublishing(false);
  }
}
```

## Change Detection
Changes should be tracked by parent component or global state. This component just displays and publishes them.

Possible change structure:
```
{
  path: "/content/pages/home.json",
  status: "modified", // or "added" or "deleted"
  content: "...", // new content for added/modified
  diff: "...", // optional diff string
}
```

## Diff Display
- Use `<pre>` tag for diff output
- Color code additions (green) and deletions (red)
- Support expandable diffs for large changes
- Syntax highlighting optional (using library like react-diff-viewer)

## Commit Message Best Practices
Suggest good commit messages:
- "Update home page layout"
- "Add new About page"
- "Create custom Header component"
- "Fix navigation links"

Show examples or templates on empty state.

## Git Operations
This component handles multiple file commits. Consider:
- Batching commits vs. individual commits per file
- Using GitHub's Git Tree API for atomic multi-file commits
- Handling merge conflicts
- Showing commit history

## Default Export
Export the PublishManager component as default export.

## Implementation Notes
- Validate commit message before allowing publish
- Show progress indicator during publish
- Handle API rate limits gracefully
- Provide link to view commit on GitHub
- Clear form after successful publish
- Show success notification
- Handle errors with helpful messages
- Support markdown in commit messages (optional)
- Preview changes before publishing
- Show file contents diff, not just paths
- Consider auto-save vs. explicit publish
- Implement optimistic UI updates
