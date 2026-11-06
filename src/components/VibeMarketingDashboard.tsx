"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {motion} from "motion/react";
import {vibeLessons,vibeLessonId} from "@/data/vibeMarketing";
import {readProgress} from "@/lib/progress";
import type {ProgressState} from "@/lib/progress";
export default function VibeMarketingDashboard({studentName}:{studentName:string}){
 const [progress,setProgress]=useState<ProgressState|null>(null);
 const [error,setError]=useState("");
 useEffect(()=>{readProgress().then(setProgress).catch(()=>setError("Progress belum dapat disinkronkan. Coba muat ulang halaman."));},[]);
 const done=vibeLessons.filter(l=>progress?.completedLessons.includes(vibeLessonId(l.slug))).length;
 const exercises=vibeLessons.filter(l=>progress?.completedExercises?.includes(vibeLessonId(l.slug))).length;
 const percent=Math.round(100*done/vibeLessons.length);
 const next=vibeLessons.find(l=>!progress?.completedLessons.includes(vibeLessonId(l.slug)))||vibeLessons[0];
 const stages=[...new Set(vibeLessons.map(l=>l.phase))];
 return <div className="container page-space vibe-course">
   <motion.section className="vibe-hero" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.35}}>
    <div><span className="eyebrow">Koding Kecerdasan · Khusus XII IPS</span>
    <h1>Vibe Coding untuk Digital Marketing</h1>
    <p>Bangun solusi pemasaran UMKM dengan AI, prompt engineering, landing page, konten promosi, dan analisis sederhana. Tidak perlu menguasai Python terlebih dahulu.</p>
    <div className="course-meta"><span>16 pertemuan · 2 JP</span><span>Berbasis proyek</span><span>HP & Chromebook</span><span>AI sebagai copilot, bukan pengganti berpikir</span></div>
    <div className="student-dashboard-actions"><Link className="btn primary" href={`/belajar/koding-kecerdasan-xii-ips/${next.slug}`}>▶ {done?"Lanjutkan":"Mulai"} Belajar</Link><Link className="btn ghost" href="/progress">Progress akun</Link></div></div>
    <div className="vibe-hero-stat"><strong>{percent}%</strong><span>Materi diselesaikan</span><div className="vibe-meter"><i style={{width:percent+"%"}}/></div><small>{done}/{vibeLessons.length} lesson · {exercises} tugas dikirim</small></div>
   </motion.section>
   {error&&<p role="alert" className="task-message bad">{error}</p>}
   <section className="vibe-syllabus"><span className="eyebrow">Silabus praktik</span><h2>Dari ide bisnis sampai kampanye digital</h2>
   <p className="muted">Setiap pertemuan: pahami kasus → susun prompt → buat artefak → uji dan revisi → kirim tugas → quiz. Nilai dan XP tersimpan pada akun masing-masing.</p>
   {stages.map(stage=><div className="vibe-stage" key={stage}><h3>{stage}</h3><div className="vibe-lesson-grid">{vibeLessons.filter(l=>l.phase===stage).map(l=>{
    const id=vibeLessonId(l.slug);const complete=Boolean(progress?.completedLessons.includes(id));const submitted=Boolean(progress?.completedExercises?.includes(id));
    return <Link className="vibe-lesson-card" href={`/belajar/koding-kecerdasan-xii-ips/${l.slug}`} key={l.slug}>
      <span className="vibe-lesson-number">{String(vibeLessons.indexOf(l)+1).padStart(2,"0")}</span>
      <div><strong>{l.title}</strong><p>{l.outcome}</p><small>{complete?"✓ Lesson":"○ Lesson"} · {submitted?"✓ Tugas dikirim":"+20 XP tugas"} · Quiz +50 XP</small></div><b aria-hidden="true">→</b>
    </Link>})}</div></div>)}</section>
   <section className="vibe-disclaimer"><strong>Catatan untuk guru dan siswa:</strong> Tugas menggunakan contoh usaha dan angka simulasi. Pemeriksaan otomatis hanya memeriksa kelengkapan dasar; kualitas, etika, dan keaslian hasil tetap ditinjau guru. Jangan mengunggah data pelanggan nyata ke AI publik.</section>
 </div>;
}