let pyodideReady = false;
let pyodide;

async function loadPyodideAndPackages() {
  pyodide = await loadPyodide();
  pyodideReady = true;
}

loadPyodideAndPackages();

document.getElementById("runBtn").addEventListener("click", async () => {
  const code = document.getElementById("editor").value;
  const output = document.getElementById("output");

  if (!pyodideReady) {
    output.textContent = "Loading Python...";
    output.classList.add("show");
    return;
  }

  try {
    let result = await pyodide.runPythonAsync(code);
    output.textContent = result ?? "Code executed successfully.";
  } catch (err) {
    output.textContent = err;
  }

  output.classList.add("show");
});
