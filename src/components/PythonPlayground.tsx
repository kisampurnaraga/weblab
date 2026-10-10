"use client";

import { useEffect, useRef, useState } from "react";

type WorkerMessage =
  | { type: "ready" }
  | { type: "result"; output: string }
  | { type: "error"; error: string };

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.29.5/full/pyodide.js";
const PYODIDE_INDEX = "https://cdn.jsdelivr.net/pyodide/v0.29.5/full/";

function makeWorker() {
  const workerSource = `
    let pyodide = null;
    const PYODIDE_URL = ${JSON.stringify(PYODIDE_URL)};
    const PYODIDE_INDEX = ${JSON.stringify(PYODIDE_INDEX)};
    async function ensurePyodide() {
      if (pyodide) return pyodide;
      importScripts(PYODIDE_URL);
      pyodide = await self.loadPyodide({ indexURL: PYODIDE_INDEX });
      postMessage({ type: "ready" });
      return pyodide;
    }
    self.onmessage = async (event) => {
      const { code, input } = event.data;
      const out = [];
      try {
        const py = await ensurePyodide();
        py.setStdout({ batched: (s) => out.push(s) });
        py.setStderr({ batched: (s) => out.push(s) });
        py.globals.set("__weblab_code", code);
        py.globals.set("__weblab_input_lines", String(input || "").split("\\n"));
        await py.runPythonAsync(\`
import builtins
__weblab_iter = iter(__weblab_input_lines)
__weblab_original_input = builtins.input

def __weblab_input(prompt=""):
    if prompt:
        print(prompt, end="")
    try:
        value = next(__weblab_iter)
        print(value)
        return value
    except StopIteration:
        return ""

builtins.input = __weblab_input
try:
    exec(__weblab_code, {"__name__": "__main__"})
finally:
    builtins.input = __weblab_original_input
        \`);
        postMessage({ type: "result", output: out.join("\\n") });
      } catch (error) {
        postMessage({ type: "error", error: String(error), output: out.join("\\n") });
      }
    };
  `;
  const blob = new Blob([workerSource], { type: "text/javascript" });
  return new Worker(URL.createObjectURL(blob));
}

export default function PythonPlayground({ initialCode = 'print("Hello, webLab!")', compact = false }: { initialCode?: string; compact?: boolean }) {
  const [code, setCode] = useState(initialCode);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Python belum dijalankan.");
  const [status, setStatus] = useState<"idle" | "loading" | "running" | "done" | "error">("idle");
  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<number | null>(null);

  const resetWorker = () => {
    workerRef.current?.terminate();
    workerRef.current = makeWorker();
    workerRef.current.onmessage = (event: MessageEvent<WorkerMessage & { output?: string }>) => {
      if (event.data.type === "ready") {
        setStatus((s) => (s === "loading" ? "idle" : s));
      }
      if (event.data.type === "result") {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        setOutput(event.data.output || "Kode selesai tanpa output. Gunakan print() untuk menampilkan hasil.");
        setStatus("done");
      }
      if (event.data.type === "error") {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        setOutput(`${event.data.output ? event.data.output + "\n\n" : ""}${event.data.error}`);
        setStatus("error");
      }
    };
  };

  useEffect(() => {
    resetWorker();
    return () => workerRef.current?.terminate();
  }, []);

  const run = () => {
    if (!workerRef.current) resetWorker();
    setStatus("running");
    setOutput("Menjalankan kode...");
    workerRef.current?.postMessage({ code, input });
    timerRef.current = window.setTimeout(() => {
      workerRef.current?.terminate();
      setOutput("Eksekusi dihentikan setelah 6 detik. Periksa kemungkinan infinite loop.");
      setStatus("error");
      resetWorker();
    }, 6000);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      run();
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const target = event.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const next = code.slice(0, start) + "    " + code.slice(end);
      setCode(next);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  return (
    <section className={`playground ${compact ? "playground-compact" : ""}`}>
      <div className="playground-toolbar">
        <div>
          <span className={`status-dot ${status}`} />
          <strong>{status === "running" ? "Menjalankan..." : status === "error" ? "Error" : "Python Playground"}</strong>
        </div>
        <div className="toolbar-actions">
          <button className="btn ghost" onClick={() => { setCode(initialCode); setOutput("Kode direset."); }}>Reset</button>
          <button className="btn primary" onClick={run} disabled={status === "running"}>Run ▶</button>
        </div>
      </div>
      <label className="editor-label" htmlFor="python-code">main.py</label>
      <textarea id="python-code" className="code-editor" spellCheck={false} value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={handleKeyDown} aria-label="Editor kode Python" />
      <details className="input-panel">
        <summary>Program Input (opsional)</summary>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={"Satu jawaban input() per baris\nContoh:\nAhmad\nXI"} />
      </details>
      <div className="output-head"><strong>Output Program</strong><button className="link-button" onClick={() => setOutput("")}>Bersihkan</button></div>
      <pre className={`output ${status === "error" ? "output-error" : ""}`}>{output}</pre>
      <p className="keyboard-hint">Tip: Ctrl/Cmd + Enter untuk menjalankan. Eksekusi berhenti otomatis setelah 6 detik.</p>
    </section>
  );
}
