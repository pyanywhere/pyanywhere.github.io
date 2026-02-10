const runBtn = document.getElementById("runBtn");
const clearBtn = document.getElementById("clearBtn");
const editor = document.getElementById("editor");
const statusLabel = document.getElementById("status");
const outputModal = document.getElementById("outputModal");
const outputBox = document.getElementById("outputBox");
const closeModalBtn = document.getElementById("closeModal");
const backdrop = outputModal.querySelector(".modal-backdrop");

let pyodide = null;
let pyodidePromise = null;

const openModal = () => {
  outputModal.classList.add("visible");
  outputModal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  outputModal.classList.remove("visible");
  outputModal.setAttribute("aria-hidden", "true");
};

const setStatus = (text) => {
  statusLabel.textContent = text;
};

const setRunning = (running) => {
  runBtn.disabled = running;
  runBtn.textContent = running ? "Running..." : "Run Code";
};

const setOutput = (text, isError = false) => {
  outputBox.textContent = text;
  outputBox.classList.toggle("error", isError);
  openModal();
};

const normalizeResult = (result) => {
  if (!result) {
    return { stdout: "", stderr: "", error: "" };
  }

  if (result instanceof Map) {
    return {
      stdout: String(result.get("stdout") ?? ""),
      stderr: String(result.get("stderr") ?? ""),
      error: String(result.get("error") ?? ""),
    };
  }

  return {
    stdout: String(result.stdout ?? ""),
    stderr: String(result.stderr ?? ""),
    error: String(result.error ?? ""),
  };
};

async function ensurePyodide() {
  if (pyodide) return pyodide;

  if (!pyodidePromise) {
    setStatus("Loading Python runtime...");
    pyodidePromise = loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
    });
  }

  try {
    pyodide = await pyodidePromise;
    setStatus("Python runtime ready.");
    return pyodide;
  } catch (error) {
    pyodidePromise = null;
    pyodide = null;
    throw error;
  }
}

async function runPythonCode(code) {
  pyodide.globals.set("_user_code", code);

  const proxy = await pyodide.runPythonAsync(`
import io
import traceback
from contextlib import redirect_stdout, redirect_stderr

_stdout = io.StringIO()
_stderr = io.StringIO()
_error = ""

try:
    with redirect_stdout(_stdout), redirect_stderr(_stderr):
        exec(str(_user_code), {})
except Exception:
    _error = traceback.format_exc()

{"stdout": _stdout.getvalue(), "stderr": _stderr.getvalue(), "error": _error}
`);

  const result = proxy.toJs ? proxy.toJs({ dict_converter: Object.fromEntries }) : proxy;
  if (proxy.destroy) proxy.destroy();
  return normalizeResult(result);
}

runBtn.addEventListener("click", async () => {
  const code = editor.value.trim();

  if (!code) {
    setOutput("Please write some Python code before running.", true);
    return;
  }

  setRunning(true);

  try {
    await ensurePyodide();
    setStatus("Running your code...");

    const result = await runPythonCode(code);
    const chunks = [];

    if (result.stdout) chunks.push(result.stdout.trimEnd());
    if (result.stderr) chunks.push(`stderr:\n${result.stderr.trimEnd()}`);
    if (result.error) chunks.push(result.error.trimEnd());

    if (!chunks.length) {
      chunks.push("No printed output. Use print(...) to display values.");
    }

    setOutput(chunks.join("\n\n"), Boolean(result.error));
    setStatus("Done. Ready for next run.");
  } catch (error) {
    setOutput(`Execution failed:\n${error}`, true);
    setStatus("Runtime error. Try again.");
  } finally {
    setRunning(false);
  }
});

clearBtn.addEventListener("click", () => {
  outputBox.textContent = "Output cleared.";
  outputBox.classList.remove("error");
  setStatus("Output cleared.");
});

closeModalBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && outputModal.classList.contains("visible")) {
    closeModal();
  }

  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    runBtn.click();
  }
});
