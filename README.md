# PyAnyWhere

PyAnyWhere is a lightweight browser Python editor built with HTML, CSS, and JavaScript.

## What it does
- Dark, responsive editor UI.
- Run Python code in the browser using Pyodide.
- Show output/errors in a popup modal when **Run** is clicked.

## Files
- `index.html` — layout and modal structure.
- `style.css` — black theme + responsive styles.
- `script.js` — Pyodide loading, code execution, and output handling.

## Notes
- Pyodide loads on first run to avoid long initial page load.
- If runtime loading fails, the app resets state so running again retries initialization.
Plan a simple, in-browser Python editor where anyone can write, view, and run Python code with a black UI and an animated output panel.

## Goals
- **Simple UI**: Minimal layout on a black background.
- **Editor + Output**: Users write Python and see results in an animated output box.
- **Runs anywhere**: Works directly in the browser using HTML, CSS, and JS.

## Proposed UX
1. **Header**: Title “PyAnyWhere” and a short tagline.
2. **Editor area**: Monospace text area for Python code.
3. **Run button**: Prominent, centered action.
4. **Output panel**: Smoothly animates in when results are shown.

## Technical Approach
- **HTML**: Single-page layout with header, editor, run button, and output panel.
- **CSS**:
  - Black background (`#000`).
  - Light text (white/gray) with a neon accent for buttons.
  - Output animation via `opacity` + `transform` transitions.
- **JavaScript**:
  - Wire up the Run button.
  - Use **Pyodide** to execute Python in the browser.
  - Capture and render stdout/stderr to the output panel.

## UI Wireframe (text)
```
[ PyAnyWhere ]  (tagline)

[ Editor: Python code input .............................. ]

           [ Run ]

[ Output panel (animated reveal) ........................ ]
```

## Implementation Steps
1. Build the layout in `index.html`.
2. Style it in `style.css` with a black theme and neon accents.
3. Add animation classes for output reveal.
4. In `script.js`, load Pyodide and execute code on Run.
5. Render output into the animated output panel.

## Optional Enhancements
- Syntax highlighting (e.g., CodeMirror).
- “Clear” button to reset output.
- Loading indicator while Pyodide initializes.
