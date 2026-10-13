"use client";

import { useEffect, useRef, useState } from "react";

type WorkerMessage =
  | { type: "ready" }
  | { type: "started" }
  | { type: "result"; output: string }
  | { type: "error"; error: string; output?: string };

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.29.5/full/pyodide.js";
const PYODIDE_INDEX = "https://cdn.jsdelivr.net/pyodide/v0.29.5/full/";
const EXECUTION_TIMEOUT_MS = 6000;

function makeWorker() {
  const workerSource = `
    let pyodide = null;
    let loadingPromise = null;
    const PYODIDE_URL = ${JSON.stringify(PYODIDE_URL)};
    const PYODIDE_INDEX = ${JSON.stringify(PYODIDE_INDEX)};
    async function ensurePyodide() {
      if (pyodide) return pyodide;
      if (!loadingPromise) loadingPromise = (async () => { importScripts(PYODIDE_URL); pyodide = await self.loadPyodide({ indexURL: PYODIDE_INDEX }); postMessage({ type: "ready" }); return pyodide; })();
      return loadingPromise;
    }
    self.onmessage = async (event) => {
      if (event.data?.type === "init") { try { await ensurePyodide(); } catch (error) { postMessage({ type: "error", error: "Gagal memuat Python runtime: " + String(error) }); } return; }
      const { code, input } = event.data;
      const out = [];
      try {
        const py = await ensurePyodide();
        postMessage({ type: "started" });
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

type PlaygroundProps = {
  initialCode?: string;
  compact?: boolean;
  onCodeChange?: (code: string) => void;
  onRunResult?: (result: { code: string; output: string; ok: boolean }) => void;
};

export default function PythonPlayground({ initialCode = 'print("Hello, webLab!")', compact = false, onCodeChange, onRunResult }: PlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Python sedang disiapkan...");
  const [status, setStatus] = useState<"idle" | "loading" | "running" | "done" | "error">("loading");
  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<number | null>(null);
  const readyRef = useRef(false);
  const codeRef = useRef(initialCode);

  const setEditorCode = (next: string) => {
    codeRef.current = next;
    setCode(next);
    onCodeChange?.(next);
  };

  const clearTimer = () => {
    if (timerRef.current !== null) { window.clearTimeout(timerRef.current); timerRef.current = null; }
  };

  const startExecutionTimer = () => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      workerRef.current?.terminate();
      readyRef.current = false;
      const message = "Eksekusi dihentikan setelah 6 detik. Periksa kemungkinan infinite loop.";
      setOutput(message);
      setStatus("error");
      onRunResult?.({ code: codeRef.current, output: message, ok: false });
      resetWorker();
    }, EXECUTION_TIMEOUT_MS);
  };

  const resetWorker = () => {
    clearTimer();
    workerRef.current?.terminate();
    readyRef.current = false;
    const worker = makeWorker();
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      if (event.data.type === "ready") {
        readyRef.current = true;
        setStatus((s) => (s === "loading" ? "idle" : s));
        setOutput((current) => current === "Python sedang disiapkan..." ? "Python siap. Tekan Run untuk menjalankan kode." : current);
      }
      if (event.data.type === "started") { setStatus("running"); setOutput("Menjalankan kode..."); startExecutionTimer(); }
      if (event.data.type === "result") {
        clearTimer();
        const resultOutput = event.data.output || "Kode selesai tanpa output. Gunakan print() untuk menampilkan hasil.";
        setOutput(resultOutput);
        setStatus("done");
        onRunResult?.({ code: codeRef.current, output: resultOutput, ok: true });
      }
      if (event.data.type === "error") {
        clearTimer();
        const resultOutput = `${event.data.output ? event.data.output + "\n\n" : ""}${event.data.error}`;
        setOutput(resultOutput);
        setStatus("error");
        onRunResult?.({ code: codeRef.current, output: resultOutput, ok: false });
      }
    };
    worker.postMessage({ type: "init" });
  };

  useEffect(() => {
    codeRef.current = initialCode;
    onCodeChange?.(initialCode);
    resetWorker();
    return () => { clearTimer(); workerRef.current?.terminate(); };
  }, []);

  const run = () => {
    if (!workerRef.current) resetWorker();
    if (!readyRef.current) { setStatus("loading"); setOutput("Menyiapkan Python runtime... Kode akan dijalankan otomatis setelah siap."); }
    else { setStatus("running"); setOutput("Menjalankan kode..."); }
    workerRef.current?.postMessage({ type: "run", code, input });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); run(); }
    if (event.key === "Tab") {
      event.preventDefault();
      const target = event.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const next = code.slice(0, start) + "    " + code.slice(end);
      setEditorCode(next);
      requestAnimationFrame(() => { target.selectionStart = target.selectionEnd = start + 4; });
    }
  };

  const statusLabel = status === "loading" ? "Menyiapkan Python..." : status === "running" ? "Menjalankan..." : status === "error" ? "Error" : status === "done" ? "Selesai" : "Python siap";

  return <section className={`playground ${compact ? "playground-compact" : ""}`}>
    <div className="playground-toolbar"><div><span className={`status-dot ${status}`} /><strong>{statusLabel}</strong></div><div className="toolbar-actions"><button className="btn ghost" onClick={() => { setEditorCode(initialCode); setOutput(readyRef.current ? "Kode direset. Python siap." : "Python sedang disiapkan..."); }}>Reset</button><button className="btn primary" onClick={run} disabled={status === "running"}>Run ▶</button></div></div>
    <label className="editor-label" htmlFor="python-code">main.py</label>
    <textarea id="python-code" className="code-editor" spellCheck={false} value={code} onChange={(e) => setEditorCode(e.target.value)} onKeyDown={handleKeyDown} aria-label="Editor kode Python" />
    <details className="input-panel"><summary>Program Input (opsional)</summary><textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={"Satu jawaban input() per baris\nContoh:\nAhmad\nXI"} /></details>
    <div className="output-head"><strong>Output Program</strong><button className="link-button" onClick={() => setOutput("")}>Bersihkan</button></div>
    <pre className={`output ${status === "error" ? "output-error" : ""}`}>{output}</pre>
    <p className="keyboard-hint">Tip: Ctrl/Cmd + Enter untuk menjalankan. Batas 6 detik dihitung setelah Python runtime siap.</p>
  </section>;
}
