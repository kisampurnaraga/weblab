"use client";
import {useCallback,useEffect,useState} from "react";
import Link from "next/link";
import {EMPTY_PROGRESS,readProgress,type ProgressState} from "@/lib/progress";
import {pythonModules} from "@/data/python";
import {htmlCssModules} from "@/data/htmlcss";
import {vibeLessons,vibeLessonId} from "@/data/vibeMarketing";

const tracks=[
 {name:"Python Programming",href:"/belajar/python",ids:pythonModules.flatMap(m=>m.lessons.map(l=>m.slug+"/"+l.slug)),description:"Kode Python, debugging, dan backend"},
 {name:"HTML & CSS",href:"/belajar/html-css",ids:htmlCssModules.flatMap(m=>m.lessons.map(l=>"html-css/"+m.slug+"/"+l.slug)),description:"Struktur web, layout, live preview"},
 {name:"Koding Kecerdasan · XII IPS",href:"/belajar/koding-kecerdasan-xii-ips",ids:vibeLessons.map(l=>vibeLessonId(l.slug)),description:"Vibe coding, AI, dan Digital Marketing"}
];

export default function ProgressClient(){
 const [progress,setProgress]=useState<ProgressState>(EMPTY_PROGRESS);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const refresh=useCallback(async()=>{
  try{const p=await readProgress();setProgress(p);setError("");}
  catch(e){setError(e instanceof Error?e.message:"Gagal membaca progress. Periksa koneksi Google Sheets.");}
  finally{setLoading(false);}
 },[]);
 useEffect(()=>{
  void refresh();
  const visible=()=>{if(!document.hidden)void refresh();};
  const focus=()=>void refresh();
  window.addEventListener("pageshow",focus);
  document.addEventListener("visibilitychange",visible);
  return ()=>{window.removeEventListener("pageshow",focus);document.removeEventListener("visibilitychange",visible);};
 },[refresh]);
 const lessons=tracks.reduce((sum,t)=>sum+t.ids.filter(id=>progress.completedLessons.includes(id)).length,0);
 const quizzes=tracks.reduce((sum,t)=>sum+t.ids.filter(id=>(progress.quizScores[id]||0)>=75).length,0);
 const tasks=tracks.reduce((sum,t)=>sum+t.ids.filter(id=>(progress.completedExercises||[]).includes(id)).length,0);
 const values=tracks.flatMap(t=>t.ids.map(id=>progress.quizScores[id]).filter((v):v is number=>typeof v==="number"));
 const avg=values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):0;
 return <div className="container page-space">
  <div className="page-heading"><span className="eyebrow">Dashboard Siswa</span><h1>Progress Belajar</h1><p>Progress dari semua course menggunakan akun yang sama. XP bertambah saat aktivitas berhasil disimpan.</p><button className="btn ghost" onClick={()=>{setLoading(true);void refresh();}} disabled={loading}>↻ Sinkronkan progress</button></div>
  {error&&<div className="task-message bad" role="alert">{error}<button className="btn ghost" onClick={()=>void refresh()}>Coba lagi</button></div>}
  <div className="stats-grid">
   <div className="stat-card"><span>Total XP Akun</span><strong aria-live="polite">{loading?"…":progress.xp}</strong><small>Reward dari seluruh track</small></div>
   <div className="stat-card"><span>Lesson selesai</span><strong>{loading?"…":lessons}</strong><small>Gabungan semua track</small></div>
   <div className="stat-card"><span>Tugas divalidasi</span><strong>{loading?"…":tasks}</strong><small>Termasuk proyek XII IPS</small></div>
   <div className="stat-card"><span>Quiz lulus</span><strong>{loading?"…":quizzes}</strong><small>Rata-rata skor: {avg}%</small></div>
  </div>
  <section className="vibe-syllabus" aria-label="Progress tiap course"><span className="eyebrow">Learning Tracks</span><h2>Progress per mata pelajaran</h2>
  <div className="vibe-lesson-grid">{tracks.map(t=>{
    const total=t.ids.length;
    const done=t.ids.filter(id=>progress.completedLessons.includes(id)).length;
    const taskDone=t.ids.filter(id=>(progress.completedExercises||[]).includes(id)).length;
    const quizDone=t.ids.filter(id=>(progress.quizScores[id]||0)>=75).length;
    const percent=t.href.includes("koding-kecerdasan")?Math.round((taskDone+quizDone)/(Math.max(total,1)*2)*100):Math.round(done/Math.max(total,1)*100);
    return <div className="vibe-panel" key={t.href}><span className="eyebrow">{t.name}</span><h3>{loading?"…":percent+"%"} selesai</h3><p>{t.description}</p><div className="vibe-meter" role="progressbar" aria-label={"Progress "+t.name} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><i style={{width:percent+"%"}}/></div><p>{done}/{total} lesson · {taskDone} tugas · {quizDone} quiz lulus</p><Link className="btn primary" href={t.href}>Buka materi →</Link></div>;
  })}</div></section>
 </div>;
}