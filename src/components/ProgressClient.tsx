"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { EMPTY_PROGRESS, readProgress, type ProgressState } from "@/lib/progress";
import { pythonModules, totalLessons } from "@/data/python";
export default function ProgressClient() {
  const [progress,setProgress]=useState<ProgressState>(EMPTY_PROGRESS); const [loading,setLoading]=useState(true);
  useEffect(()=>{readProgress().then(setProgress).finally(()=>setLoading(false));},[]);
  const percent=totalLessons?Math.round(progress.completedLessons.length/totalLessons*100):0; const values=Object.values(progress.quizScores); const avg=values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):0;
  return <div className="container page-space"><div className="page-heading"><span className="eyebrow">Dashboard Siswa</span><h1>Progress Belajar</h1><p>{loading?"Mengambil progress akun...":"Progress ini tersimpan pada akunmu dan dapat dilanjutkan dari perangkat lain."}</p></div><div className="stats-grid"><div className="stat-card"><span>Progress Python</span><strong>{percent}%</strong><div className="progress"><span style={{width:`${percent}%`}}/></div></div><div className="stat-card"><span>XP</span><strong>{progress.xp}</strong><small>Tersinkron ke akun siswa</small></div><div className="stat-card"><span>Lesson Selesai</span><strong>{progress.completedLessons.length}/{totalLessons}</strong><small>{pythonModules.length} modul tersedia</small></div><div className="stat-card"><span>Rata-rata Quiz</span><strong>{avg}%</strong><small>{values.length} quiz dikerjakan</small></div></div><div className="section-head"><div><span className="eyebrow">Lanjut belajar</span><h2>Python Learning Path</h2></div><Link className="btn primary" href="/belajar/python">Buka Course</Link></div></div>;
}
