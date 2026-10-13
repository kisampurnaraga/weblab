import type { HtmlCssVisual } from "@/data/htmlcss";

export default function HtmlCssConceptVisual({ visual }: { visual: HtmlCssVisual }) {
  if (visual === "document") return <div className="concept-visual document-visual" aria-label="Diagram struktur dokumen HTML">
    <div className="browser-mini"><div className="browser-mini-bar"><i/><i/><i/><span>index.html</span></div><div className="browser-mini-page"><header>HEADER</header><main><section><b>H1</b><small>Judul utama</small></section><section><b>P</b><small>Isi paragraf</small></section></main><footer>FOOTER</footer></div></div>
    <div className="visual-explain"><strong>HTML = kerangka halaman</strong><p>Seperti rumah: sebelum memilih cat dan dekorasi, kita menentukan dulu ruang, pintu, dan susunannya.</p></div>
  </div>;

  if (visual === "link-image") return <div className="concept-visual link-image-visual"><div className="image-demo"><div className="fake-photo">🖼️</div><span>&lt;img src="..." alt="..."&gt;</span></div><div className="arrow-flow">klik →</div><div className="link-demo">🔗 halaman tujuan<br/><code>href="..."</code></div></div>;

  if (visual === "table") return <div className="concept-visual"><div className="visual-table"><div className="th">Hari</div><div className="th">Mapel</div><div>Senin</div><div>Informatika</div><div>Selasa</div><div>Bahasa</div></div><p className="visual-caption">Tabel dipakai ketika hubungan baris–kolom memang bermakna. Jangan memakai tabel hanya untuk mengatur layout.</p></div>;

  if (visual === "form") return <div className="concept-visual form-flow"><div className="flow-box">👤 Pengguna</div><b>→</b><div className="flow-box">📝 Form</div><b>→</b><div className="flow-box">📦 Data</div><p className="visual-caption">HTML membuat kontrol input. Pengolahan datanya nanti dilakukan JavaScript atau backend.</p></div>;

  if (visual === "selector") return <div className="concept-visual selector-visual"><div className="dom-chip"><span className="tag">&lt;section</span> <span className="attr">class="card"</span><span className="tag">&gt;</span></div><b className="selector-arrow">↓ dipilih oleh</b><div className="css-chip"><span>.card</span> &#123; background: ...; &#125;</div></div>;

  if (visual === "box-model") return <div className="concept-visual box-model-visual"><div className="margin-box"><span>margin</span><div className="border-box"><span>border</span><div className="padding-box"><span>padding</span><div className="content-box">content</div></div></div></div></div>;

  if (visual === "flex") return <div className="concept-visual flex-visual"><div className="axis main-axis">main axis →</div><div className="flex-items"><div>A</div><div>B</div><div>C</div></div><div className="axis cross-axis">↕ cross axis</div><p className="visual-caption"><code>justify-content</code> bekerja pada main axis; <code>align-items</code> pada cross axis.</p></div>;

  if (visual === "grid") return <div className="concept-visual"><div className="grid-visual">{[1,2,3,4,5,6].map(x=><div key={x}>{x}</div>)}</div><p className="visual-caption">Grid mengatur baris dan kolom sekaligus. Cocok untuk gallery, dashboard, dan layout kartu.</p></div>;

  if (visual === "responsive") return <div className="concept-visual responsive-visual"><div className="device phone"><b>📱</b><span>1 kolom</span></div><b>→</b><div className="device tablet"><b>▣</b><span>2 kolom</span></div><b>→</b><div className="device desktop"><b>🖥️</b><span>3 kolom</span></div><p className="visual-caption">Konten sama, susunannya beradaptasi dengan ruang yang tersedia.</p></div>;

  if (visual === "motion") return <div className="concept-visual motion-visual"><div className="motion-state"><button>Normal</button><span>→ hover →</span><button className="lifted">Naik + shadow</button></div><p className="visual-caption">Motion adalah feedback. Pengguna harus tetap memahami UI meski animasi dimatikan.</p></div>;

  if (visual === "component") return <div className="concept-visual component-visual"><div className="component-token">🎨 Token<br/><small>warna · radius · spacing</small></div><b>→</b><div className="component-stack"><span>Navbar</span><span>Hero</span><span>Card</span><span>CTA</span></div><b>→</b><div className="component-page">🌐 Website konsisten</div></div>;

  return <div className="concept-visual portfolio-visual"><div className="portfolio-map"><span>Navbar</span><span className="hero-map">Hero + CTA</span><span>About</span><span>Projects</span><span>Contact</span></div><p className="visual-caption">Final project bukan membuat semua sekaligus. Bangun per section, cek responsif, lalu polish.</p></div>;
}
