import Link from "next/link";
import { pythonModules, totalLessons } from "@/data/python";

export default function Home() {
  const upcomingTracks = ["JavaScript", "Frontend", "Backend", "Artificial Intelligence"];

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Interactive Coding School</span>
            <h1>Belajar Coding.<br/>Praktik Langsung.<br/><span>Bangun Project Nyata.</span></h1>
            <p>webLab mengajarkan coding melalui visual konsep, eksperimen, debugging, latihan, quiz, dan project. Python serta HTML & CSS sudah bisa dipelajari sekarang.</p>
            <div className="hero-actions">
              <Link className="btn primary large" href="/belajar">Pilih Materi Belajar</Link>
              <Link className="btn ghost large" href="/playground/python">Buka Playground Python</Link>
            </div>
            <div className="hero-metrics"><span><strong>{pythonModules.length}</strong> modul Python</span><span><strong>{totalLessons}</strong> lesson Python</span><span><strong>2</strong> track aktif</span></div>
          </div>
          <div className="hero-code" aria-label="Contoh kode Python">
            <div className="window-bar"><i/><i/><i/><span>main.py</span></div>
            <pre><code>{`nama = input("Nama kamu: ")

if nama:
    print(f"Halo {nama}! 👋")
    print("Selamat datang di webLab")

for level in range(1, 4):
    print("Belajar" + " 🚀" * level)`}</code></pre>
            <div className="terminal-preview">▶ Output Program<br/><strong>Halo Ahmad! 👋</strong><br/>Selamat datang di webLab<br/>Belajar 🚀<br/>Belajar 🚀🚀<br/>Belajar 🚀🚀🚀</div>
          </div>
        </div>
      </section>

      <section className="container section-space">
        <div className="section-head"><div><span className="eyebrow">Learning Tracks</span><h2>Satu platform, banyak skill.</h2></div></div>
        <div className="track-grid">
          <Link className="track-card active" href="/belajar/python">
            <span className="track-icon">Py</span>
            <div><b>Python Programming</b><p>Fundamental → Backend → Database</p></div>
            <span className="badge success">Aktif</span>
          </Link>

          <Link className="track-card active" href="/belajar/html-css">
            <span className="track-icon">&lt;/&gt;</span>
            <div><b>HTML & CSS</b><p>Struktur halaman → Layout → Responsive Portfolio</p></div>
            <span className="badge success">Aktif</span>
          </Link>

          {upcomingTracks.map((track) => (
            <div className="track-card" key={track}>
              <span className="track-icon muted-icon">&lt;/&gt;</span>
              <div><b>{track}</b><p>Learning track berikutnya</p></div>
              <span className="badge">Segera hadir</span>
            </div>
          ))}
        </div>
      </section>

      <section className="learn-loop"><div className="container"><span className="eyebrow">Cara Belajar webLab</span><h2>Bukan hanya membaca teori.</h2><div className="loop-grid">{["01 Kenali Konsep","02 Lihat Visual & Contoh","03 Coba & Run","04 Debug","05 Exercise","06 Quiz","07 Build Project"].map((item) => <div key={item}>{item}</div>)}</div></div></section>
    </>
  );
}
