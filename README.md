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
