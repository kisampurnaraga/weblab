"use client";

import { useMemo, useState } from "react";

export default function HtmlCssPlayground({ initialHtml, initialCss, compact = false }: { initialHtml: string; initialCss: string; compact?: boolean }) {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [tab, setTab] = useState<"html" | "css">("html");

  const srcDoc = useMemo(() => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Inter,Arial,sans-serif;margin:0;padding:24px;color:#172033;background:white}${css}</style></head><body>${html}</body></html>`, [html, css]);

  const reset = () => { setHtml(initialHtml); setCss(initialCss); };

  return <div className={`web-playground ${compact ? "web-playground-compact" : ""}`}>
    <div className="web-playground-toolbar">
      <div><strong>Live Web Editor</strong><span className="badge success">Auto Preview</span></div>
      <button className="btn ghost" onClick={reset}>Reset</button>
    </div>
    <div className="web-editor-tabs">
      <button className={tab === "html" ? "active" : ""} onClick={() => setTab("html")}>HTML</button>
      <button className={tab === "css" ? "active" : ""} onClick={() => setTab("css")}>CSS</button>
    </div>
    <div className="web-editor-grid">
      <div className="web-editor-pane">
        {tab === "html" ? <textarea aria-label="HTML editor" className="code-editor web-code-editor" value={html} onChange={e => setHtml(e.target.value)} spellCheck={false} /> : <textarea aria-label="CSS editor" className="code-editor web-code-editor" value={css} onChange={e => setCss(e.target.value)} spellCheck={false} />}
      </div>
      <div className="web-preview-pane">
        <div className="preview-bar"><span></span><span></span><span></span><b>preview</b></div>
        <iframe title="Live preview HTML CSS" sandbox="allow-scripts" srcDoc={srcDoc} />
      </div>
    </div>
  </div>;
}
