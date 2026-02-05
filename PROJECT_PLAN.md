# PyAnyWhere Planning Blueprint

## Product Vision
Build **PyAnyWhere** as a browser-based Python playground where anyone can write, view, and run Python code with:
- a simple black UI,
- fast feedback,
- and a smooth animated output box.

## Core User Flow
1. User opens the app and sees a minimal black-themed editor.
2. User writes (or pastes) Python code.
3. User clicks **Run**.
4. App executes code in-browser (Pyodide).
5. Output panel animates in and shows stdout/stderr/error messages.

## Scope (MVP)

### Must-have
- Single-page UI with:
  - App title: **PyAnyWhere**
  - Code editor area
  - Run button
  - Output panel
- Black theme (high contrast, readable).
- Python execution in browser via Pyodide CDN.
- Smooth output animation (fade + slide).
- Basic status indicators:
  - "Runtime loading"
  - "Ready"
  - "Running"

### Nice-to-have (post-MVP)
- Snippet presets (Hello World, loop, math).
- Clear Output button.
- Keyboard shortcut: `Ctrl/Cmd + Enter` to run.
- Copy output button.

## Technical Plan

### 1) HTML structure
- `header`: app title + status badge.
- `main`: editor section and action buttons.
- `section.output`: output title and `<pre>` for results.

### 2) CSS design
- Palette:
  - background: `#000`
  - surface: `#0b0b0b`
  - border: `#1e1e1e`
  - accent: `#00ff88`
- Typography:
  - monospace for editor/output.
- Animation:
  - hidden state: `opacity: 0; transform: translateY(8px);`
  - visible state: `opacity: 1; transform: translateY(0);`
  - transition: `200–300ms ease`.

### 3) JavaScript behavior
- Lazy-load Pyodide on first Run click.
- Disable Run button while loading/running.
- Execute code with `runPythonAsync`.
- Capture:
  - `stdout`
  - `stderr`
  - exceptions/tracebacks
- Render message into output `<pre>`.
- Toggle animation class for smooth reveal.

## Security & Constraints
- This is a client-side runtime; no backend required for MVP.
- Use execution guards (timeouts/controls where possible).
- Clearly indicate browser-only execution limits to users.

## Milestones

### Milestone 1 — UI foundation (Day 1)
- Build static layout.
- Apply black theme.
- Build output panel animation.

### Milestone 2 — Runtime integration (Day 2)
- Add Pyodide loading.
- Implement Run flow and output capture.

### Milestone 3 — UX polish (Day 3)
- Improve states and edge-case handling.
- Add snippets + keyboard shortcut.
- Basic responsive refinements.

## Acceptance Criteria
- User can type Python and click Run.
- Output appears in animated panel.
- Errors are displayed clearly without breaking UI.
- UI is clean, black-themed, and responsive.
- First-run runtime load communicates status to user.
