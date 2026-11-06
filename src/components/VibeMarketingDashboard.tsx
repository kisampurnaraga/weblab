"use client";
import {useCallback,useEffect,useState} from "react";
import Link from "next/link";
import {motion} from "motion/react";
import {vibeLessons,vibeLessonId} from "@/data/vibeMarketing";
import {readProgress} from "@/lib/progress";
import type {ProgressState} from "@/lib/progress";

export default function VibeMarketingDashboard({studentName}:{studentName:string}){
 const [progress,setProgress]=useState<ProgressState|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const refresh=useCallback(async()=>{
   try{const response=await fetch("/api/progress",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({type:"vibe_sync"}),cache:"no-store"});if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||"Rekonsiliasi progress gagal.");}const p=await readProgress();setProgress(p);setError("");}
   catch(e){setError(e instanceof Error?e.message:"Progress belum dapat disinkronkan.");}
   finally{setLoading(false);}
 },[]);
 useEffect(()=>{
   void refresh();
   const onVisible=()=>{if(!document.hidden)void refresh();};
   const onFocus=()=>void refresh();
   window.addEventListener("pageshow",onFocus);
   window.addEventListener("focus",onFocus);
   document.addEventListener("visibilitychange",onVisible);
   return ()=>{window.removeEventListener("pageshow",onFocus);window.removeEventListener("focus",onFocus);document.removeEventListener("visibilitychange",onVisible);};
 },[refresh]);
 const completed=vibeLessons.filter(l=>progress?.completedLessons?.includes(vibeLessonId(l.slug))).length;
 const tasks=vibeLessons.filter(l=>progress?.completedExercises?.includes(vibeLessonId(l.slug))).length;
 const quizzes=vibeLessons.filter(l=>(progress?.quizScores?.[vibeLessonId(l.slug)]||0)>=75).length;
 // A half-finished pertemuan is visible rather than appearing stuck at 0%.
 const steps=vibeLessons.reduce((sum,l)=>{
   const id=vibeLessonId(l.slug);
   return sum+Number(Boolean(progress?.completedExercises?.includes(id)))+Number((progress?.quizScores?.[id]||0)>=75);
 },0);
 const percent=Math.round(steps/(vibeLessons.length*2)*100);
 const next=vibeLessons.find(l=>!progress?.completedLessons?.includes(vibeLessonId(l.slug)))||vibeLessons[vibeLessons.length-1];
 const stages=[...new Set(vibeLessons.map(l=>l.phase))];
 const xp=progress?.xp||0;
 return <div className="container page-space vibe-course">
   <motion.section className="vibe-hero" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.35}}>
    <div><span className="eyebrow">Koding Kecerdasan · Khusus XII IPS</span>
    <h1>Halo, {studentName}! Yuk bangun kampanye dengan AI.</h1>
    <p>Vibe coding untuk Digital Marketing: riset pelanggan, prompt, landing page, konten, dan analitik UMKM. Setiap tugas dan quiz yang lulus menambah XP akun otomatis.</p>
    <div className="course-meta"><span>16 pertemuan · 2 JP</span><span>Berbasis proyek</span><span>HP & Chromebook</span></div>
    <div className="student-dashboard-actions"><Link className="btn primary" href={`/belajar/koding-kecerdasan-xii-ips/${next.slug}`}>▶ {completed?"Lanjutkan":"Mulai"} Belajar</Link><Link className="btn ghost" href="/progress">Lihat semua XP</Link><button className="btn ghost" onClick={()=>{setLoading(true);void refresh();}} disabled={loading}>↻ Sinkronkan</button></div>
    </div>
    <div className="vibe-hero-stat"><strong aria-live="polite">{loading?"…":percent+"%"}</strong><span>Aktivitas belajar tercapai</span><div className="vibe-meter" role="progressbar" aria-label="Progress belajar XII IPS" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><i style={{width:percent+"%"}}/></div><small>{completed}/{vibeLessons.length} pertemuan tuntas</small></div>
   </motion.section>
   {error&&<div className="task-message bad" role="alert">{error} <button className="btn ghost" onClick={()=>void refresh()}>Coba lagi</button></div>}
   <section className="student-stat-grid" aria-label="Statistik belajar XII IPS">
    {[[loading?"…":xp,"⚡","Total XP akun"],[loading?"…":tasks,"📝","Tugas terkirim"],[loading?"…":quizzes,"✓","Quiz lulus"],[loading?"…":completed,"🏅","Pertemuan tuntas"]].map(([value,icon,label],i)=><div className="student-stat-card" key={String(label)}><span className="stat-icon">{icon}</span><small>{label}</small><strong>{value}</strong></div>)}
   </section>
   <section className="vibe-syllabus"><span className="eyebrow">Silabus praktik</span><h2>Dari ide bisnis sampai kampanye digital</h2><p className="muted">Progress bergerak ketika tugas dikirim (+20 XP) dan quiz lulus (+50 XP). Setelah keduanya berhasil, pertemuan otomatis tuntas (+10 XP). Reward tidak dapat diklaim dua kali.</p>
   {stages.map(stage=><div className="vibe-stage" key={stage}><h3>{stage}</h3><div className="vibe-lesson-grid">{vibeLessons.filter(l=>l.phase===stage).map(l=>{
      const id=vibeLessonId(l.slug);const complete=Boolean(progress?.completedLessons?.includes(id));const submitted=Boolean(progress?.completedExercises?.includes(id));const passed=(progress?.quizScores?.[id]||0)>=75;
      const lessonPercent=(Number(submitted)+Number(passed))*50;
      return <Link className="vibe-lesson-card" href={`/belajar/koding-kecerdasan-xii-ips/${l.slug}`} key={l.slug}>
       <span className="vibe-lesson-number">{String(vibeLessons.indexOf(l)+1).padStart(2,"0")}</span>
       <div><strong>{l.title}</strong><p>{l.outcome}</p><div className="vibe-meter" role="progressbar" aria-label={"Progress "+l.title} aria-valuenow={lessonPercent} aria-valuemin={0} aria-valuemax={100}><i style={{width:lessonPercent+"%"}}/></div><small>{complete?"✓ Selesai":submitted?"✓ Tugas":"○ Tugas"} · {passed?"✓ Quiz lulus":"○ Quiz"} · {lessonPercent}%</small></div><b aria-hidden="true">→</b>
      </Link>;
    })}</div></div>)}</section>
   <section className="vibe-disclaimer"><strong>Untuk siswa:</strong> periksa kembali hasil AI sebelum dikirim. Pemeriksaan otomatis mengukur kelengkapan, sedangkan kualitas dan orisinalitas tetap dinilai guru.</section>
 </div>;
}