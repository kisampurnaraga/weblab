import Link from "next/link";

export const metadata = { title: "Belajar" };

export default function LearnPage() {
  const courses = [
    { title: "Python Programming", desc: "Dari program pertama hingga REST API dan SQLite.", href: "/belajar/python", symbol: "Py", badge: "Aktif" },
    { title: "HTML & CSS", desc: "Dari struktur halaman sampai portfolio responsive dengan live preview.", href: "/belajar/html-css", symbol: "<>\nCSS", badge: "Baru" },
  ];
  return <div className="container page-space">
    <div className="page-heading"><span className="eyebrow">Course Library</span><h1>Mau belajar apa hari ini?</h1><p>Pilih track. Progress, quiz, XP, dan project tersimpan ke akun siswa yang sama.</p></div>
    <div className="course-library-grid">{courses.map(course => <div className="course-feature" key={course.href}><div><span className="badge success">{course.badge}</span><h2>{course.title}</h2><p>{course.desc}</p><Link className="btn primary" href={course.href}>Masuk Course</Link></div><div className="course-symbol course-library-symbol">{course.symbol.split("\n").map((x,i)=><span key={i}>{x}</span>)}</div></div>)}</div>
  </div>;
}
