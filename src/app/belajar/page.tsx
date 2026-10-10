import Link from "next/link";

export const metadata = { title: "Belajar" };
export default function LearnPage() {
  return <div className="container page-space"><div className="page-heading"><span className="eyebrow">Course Library</span><h1>Mau belajar apa hari ini?</h1><p>Mulai dari Python. Track lain akan memakai learning engine yang sama.</p></div><div className="course-feature"><div><span className="badge success">Aktif</span><h2>Python Programming</h2><p>Dari program pertama hingga REST API dan SQLite.</p><Link className="btn primary" href="/belajar/python">Masuk Course</Link></div><div className="course-symbol">Py</div></div></div>
}
