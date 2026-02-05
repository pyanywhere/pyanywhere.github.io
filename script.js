const statusBadge = document.getElementById("status");
const statusText = statusBadge.querySelector(".status-text");
const runButton = document.getElementById("runBtn");
const editor = document.getElementById("editor");
const outputBox = document.getElementById("output");
const snippetButtons = document.querySelectorAll("[data-snippet]");
const modal = document.getElementById("outputModal");
const closeModalButton = document.getElementById("closeModal");
const modalBackdrop = modal.querySelector(".modal-backdrop");

const snippets = {
  hello: 'print("Hello, PyAnyWhere!")',
  loop: 'for i in range(5):\n    print("Loop", i)',
  math: 'import math\nprint("π:", round(math.pi, 4))',
};

let pyodideReady = false;
let pyodideInstance;
let pyodidePromise;
let runCount = 0;

const updateStatus = (message, state = "idle") => {
  statusText.textContent = message;
  statusBadge.classList.remove("ready", "error", "loading");
  if (state === "ready") statusBadge.classList.add("ready");
  if (state === "error") statusBadge.classList.add("error");
  if (state === "loading") statusBadge.classList.add("loading");
};

const openModal = () => {
  modal.classList.add("is-visible");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  modal.classList.remove("is-visible");
  modal.setAttribute("aria-hidden", "true");
};

const showOutput = (message, isError = false) => {
  outputBox.textContent = message;
  outputBox.classList.toggle("error", isError);
  outputBox.classList.remove("show");
  void outputBox.offsetWidth;
  outputBox.classList.add("show");
};

const setRunning = (running) => {
  runButton.disabled = running;
  runButton.textContent = running ? "Running…" : "▶ Run";
};

async function loadPyodideAndPackages() {
  const slowLoadTimeout = setTimeout(() => {
    updateStatus("Still loading Python…", "loading");
  }, 4000);

  try {
    updateStatus("Loading Python runtime…", "loading");
    pyodideInstance = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
    });
    pyodideReady = true;
    updateStatus("Python ready", "ready");
  } catch (error) {
    pyodideReady = false;
    pyodidePromise = null;
    showOutput(`Failed to load Python runtime.\n${error}`, true);
    updateStatus("Python failed to load", "error");
    throw error;
  } finally {
    clearTimeout(slowLoadTimeout);
  }
}

const getPyodide = async () => {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodideAndPackages();
  }
  return pyodidePromise;
};

const runUserCode = async (code) => {
  pyodideInstance.globals.set("_user_code", code);
  const resultProxy = await pyodideInstance.runPythonAsync(`
import io
import traceback
from contextlib import redirect_stdout, redirect_stderr

_stdout = io.StringIO()
_stderr = io.StringIO()
_error = ""

try:
    with redirect_stdout(_stdout), redirect_stderr(_stderr):
        exec(_user_code, {})
except Exception:
    _error = traceback.format_exc()

{"stdout": _stdout.getvalue(), "stderr": _stderr.getvalue(), "error": _error}
`);

  const result = resultProxy.toJs ? resultProxy.toJs() : resultProxy;
  if (resultProxy.destroy) resultProxy.destroy();
  return result;
};

snippetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const snippetKey = button.dataset.snippet;
    editor.value = snippets[snippetKey] ?? editor.value;
    editor.focus();
  });
});

updateStatus("Click Run to load Python", "idle");

runButton.addEventListener("click", async () => {
  const code = editor.value.trim();

  if (!code) {
    showOutput("Please enter some Python code to run.");
    openModal();
    return;
  }

  setRunning(true);

  try {
    if (!pyodideReady) {
      showOutput("Loading Python runtime... Please wait.");
      openModal();
      await getPyodide();
    }

    const result = await runUserCode(code);
    const combined = [result.stdout?.trim(), result.stderr?.trim(), result.error?.trim()]
      .filter(Boolean)
      .join("\n");

    runCount += 1;
    showOutput(combined || `Run #${runCount}: Code executed successfully.`, Boolean(result.error));
    openModal();
  } catch (error) {
    showOutput(String(error), true);
    openModal();
  } finally {
    setRunning(false);
  }
});

closeModalButton.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-visible")) {
    closeModal();
  }
});
