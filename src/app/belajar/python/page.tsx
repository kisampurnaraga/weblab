import Link from "next/link";
import { pythonModules, totalLessons } from "@/data/python";

export const metadata = { title: "Belajar Python" };
export default function PythonCoursePage() {
  const stages = Array.from(new Set(pythonModules.map((m) => m.stage)));
  return <div className="container page-space">
    <div className="course-hero"><div><span className="eyebrow">Python Learning Track</span><h1>Python dari Nol sampai Backend</h1><p>Belajar logika, struktur data, debugging, OOP, API, dan database melalui praktik langsung.</p><div className="course-meta"><span>{pythonModules.length} modul</span><span>{totalLessons} lesson</span><span>Pemula → Intermediate Dasar</span></div></div><div className="course-symbol big">Py</div></div>
    {stages.map((stage) => <section className="module-stage" key={stage}><div className="stage-title"><span>{stage}</span></div><div className="module-list">{pythonModules.filter((m) => m.stage === stage).map((module) => { const first = module.lessons[0]; return <Link className="module-card" key={module.slug} href={`/belajar/python/${module.slug}/${first.slug}`}><div className="module-num">{String(module.order).padStart(2,"0")}</div><div className="module-copy"><h3>{module.title}</h3><p>{module.description}</p><div className="module-tags"><span>{module.lessons.length} lesson</span><span>Praktik</span><span>Quiz</span></div></div><span className="module-arrow">→</span></Link>})}</div></section>)}
  </div>
}
