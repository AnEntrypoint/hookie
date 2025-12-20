# Project Caveats & Technical Notes

## Design System
- **Color Scheme**: Modern blue-based (#2563eb primary) with complementary grays, greens, reds
- **Typography**: System font stack with clear hierarchy (H1: 2.5rem down to small: 0.875rem)
- **Spacing**: Base-4 system (4px multiples)
- **Transitions**: 150ms ease-in-out for smooth interactions

## Component Architecture
- All components follow spec-driven design via markdown files
- Component markdown files are at: `src/components/*.md`
- Admin components: `src/admin/*.md`
- When markdown specs are edited, hook triggers Task tool to regenerate corresponding `.js` files

## Markdown → JavaScript Workflow
- Hook: `.claude/hooks/on-md-write.cjs`
- Detects `.md` file edits
- Blocks with JSON instruction to regenerate corresponding `.js`
- Use Task tool with `frontend-react-expert` agent
- Implementation must follow design specs exactly

## Key Files
- `src/index.md` - Global design system, color palette, typography, spacing
- `src/components/` - All base component specs
- `src/admin/` - Admin interface components (PageManager, PublishManager)
- `.claude/hooks/on-md-write.cjs` - Markdown update hook (Node.js CommonJS)

## Styling Requirements
- All components use inline styles with style prop merging
- No CSS files or external stylesheets
- Props accept: color, spacing, variant, size, padding presets
- Helper functions: getSizeValue(), getSpacing(), getWeight(), getBorderRadius(), etc.

## Component States
- **Primary buttons**: Blue (#2563eb), hover lift effect, focus outline
- **Secondary buttons**: Gray background (#f1f5f9), subtle hover
- **Danger buttons**: Red outlined (#ef4444), transparent background
- **Ghost buttons**: No background, gray text, hover background

## Admin Interface
- PageManager: Grid layout, page cards with edit/duplicate/delete actions
- PublishManager: Change tracking with status badges, commit workflow
- Both use modal dialogs and elegant status displays

## Technical Constraints
- React functional components only
- No class components
- Props: always optional with sensible defaults
- Empty children/items arrays: handle gracefully
- XSS prevention: use textContent, never innerHTML
- Accessibility: proper heading hierarchy, keyboard navigation, ARIA where needed

## Development Notes
- Edit markdown specs to update component designs
- Hook will block and instruct regeneration
- Use Task tool to generate production-grade implementations
- Always test hook with: `echo '{"file_path": "src/components/X.md"}' | node .claude/hooks/on-md-write.cjs`
