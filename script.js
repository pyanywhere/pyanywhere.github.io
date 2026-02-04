const statusBadge = document.getElementById("status");
const runButton = document.getElementById("runBtn");
const clearButton = document.getElementById("clearBtn");
const editor = document.getElementById("editor");
const outputBox = document.getElementById("output");

let pyodideReady = false;
let pyodideInstance;

const updateStatus = (message, ready = false) => {
  statusBadge.textContent = message;
  statusBadge.style.color = ready ? "var(--accent)" : "var(--muted)";
};

const showOutput = (message, isError = false) => {
  outputBox.textContent = message;
  outputBox.classList.toggle("error", isError);
  outputBox.classList.remove("show");
  void outputBox.offsetWidth;
  outputBox.classList.add("show");
};

async function loadPyodideAndPackages() {
  try {
    pyodideInstance = await loadPyodide();
    pyodideReady = true;
    updateStatus("Python ready", true);
  } catch (error) {
    showOutput(`Failed to load Python runtime.\n${error}`, true);
    updateStatus("Python failed to load");
  }
}

loadPyodideAndPackages();

runButton.addEventListener("click", async () => {
  const code = editor.value.trim();

  if (!code) {
    showOutput("Please enter some Python code to run.");
    return;
  }

  if (!pyodideReady) {
    showOutput("Loading Python runtime... Please wait.");
    return;
  }

  let stdout = "";
  let stderr = "";

  pyodideInstance.setStdout({
    batched: (output) => {
      stdout += output + "\n";
    },
  });

  pyodideInstance.setStderr({
    batched: (output) => {
      stderr += output + "\n";
    },
  });

  try {
    const result = await pyodideInstance.runPythonAsync(code);
    const returnValue = result !== undefined && result !== null ? String(result) : "";
    const combined = [stdout.trim(), returnValue.trim(), stderr.trim()]
      .filter(Boolean)
      .join("\n");

    showOutput(combined || "Code executed successfully.");
  } catch (error) {
    showOutput(String(error), true);
  }
});

clearButton.addEventListener("click", () => {
  showOutput("Output cleared.");
});
