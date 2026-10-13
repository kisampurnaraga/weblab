"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { htmlCssModules, totalHtmlCssLessons } from "@/data/htmlcss";

type ProgressState = { completedLessons:string[]; quizScores:Record<string,number>; xp:number; currentLesson?:string };
const empty:ProgressState = {completedLessons:[],quizScores:{},xp:0};

export default function HtmlCssCourseDashboard({studentName}:{studentName:string}){
  const [progress,setProgress]=useState<ProgressState>(empty);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{fetch('/api/progress',{cache:'no-store'}).then(r=>r.ok?r.json():empty).then(d=>setProgress({...empty,...d})).catch(()=>setProgress(empty)).finally(()=>setLoading(false));},[]);

  const lessonIndex=useMemo(()=>htmlCssModules.flatMap(m=>m.lessons.map(l=>({id:`html-css/${m.slug}/${l.slug}`,href:`/belajar/html-css/${m.slug}/${l.slug}`}))),[]);
  const completedIds=progress.completedLessons.filter(id=>id.startsWith('html-css/'));
  const completed=completedIds.length;
  const percent=Math.min(100,Math.round(completed/Math.max(totalHtmlCssLessons,1)*100));
  const current=lessonIndex.find(l=>l.id===progress.currentLesson) ?? lessonIndex.find(l=>!completedIds.includes(l.id)) ?? lessonIndex[0];
  const stages=Array.from(new Set(htmlCssModules.map(m=>m.stage)));

  return <div className="container page-space student-course-dashboard">
    <motion.section className="student-welcome web-track-welcome" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}}>
      <div><span className="eyebrow">HTML & CSS Learning Track</span><h1>Halo, {studentName} 👋</h1><p>Bangun tampilan website dari struktur HTML sampai layout responsive dan portfolio akhir.</p><div className="student-dashboard-actions"><Link className="btn primary large" href={current?.href||'/belajar/html-css'}>{completed?"Lanjutkan belajar":"Mulai HTML & CSS"} →</Link><Link className="btn ghost large" href="/progress">Lihat progress</Link></div></div>
      <div className="progress-orbit"><div className="progress-ring" style={{"--progress":`${percent*3.6}deg`} as React.CSSProperties}><div><strong>{loading?'…':`${percent}%`}</strong><span>selesai</span></div></div></div>
    </motion.section>

    <section className="student-stat-grid">{[["XP akun",loading?'…':progress.xp,"⚡"],["Lesson HTML/CSS",loading?'…':`${completed}/${totalHtmlCssLessons}`,"✓"],["Quiz track",loading?'…':Object.keys(progress.quizScores).filter(k=>k.startsWith('html-css/')).length,"◆"],["Final Project","Portfolio","WEB"]].map(([label,value,icon],i)=><motion.div key={String(label)} className="student-stat-card" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*.06}} whileHover={{y:-4}}><span className="stat-icon">{icon}</span><small>{label}</small><strong>{value}</strong></motion.div>)}</section>

    <motion.section className="course-hero course-hero-dashboard web-course-hero" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><div><span className="eyebrow">Web Design Foundation</span><h2>HTML & CSS dari Nol sampai Portfolio</h2><p>Belajar melalui live preview: tulis kode, lihat hasil, perbaiki desain, lalu bangun website responsive.</p><div className="course-meta"><span>{htmlCssModules.length} modul</span><span>{totalHtmlCssLessons} lesson</span><span>Live Preview</span></div></div><motion.div className="course-symbol big web-symbol" animate={{y:[0,-6,0],rotate:[0,1,0]}} transition={{duration:4,repeat:Infinity}}>HTML<br/><small>CSS</small></motion.div></motion.section>

    {stages.map(stage=><section className="module-stage" key={stage}><div className="stage-title"><span>{stage}</span></div><div className="module-list">{htmlCssModules.filter(m=>m.stage===stage).map(module=>{
      const first=module.lessons[0];
      const moduleCompleted=module.lessons.filter(l=>progress.completedLessons.includes(`html-css/${module.slug}/${l.slug}`)).length;
      const modulePercent=Math.round(moduleCompleted/Math.max(module.lessons.length,1)*100);
      return <motion.div key={module.slug} whileHover={{x:5}}><Link className="module-card module-card-dashboard" href={`/belajar/html-css/${module.slug}/${first.slug}`}><div className="module-num">{String(module.order).padStart(2,'0')}</div><div className="module-copy"><div className="module-title-row"><h3>{module.title}</h3>{modulePercent===100&&<span className="module-done">Selesai ✓</span>}</div><p>{module.description}</p><div className="module-progress-row"><div className="module-progress-track"><span style={{width:`${modulePercent}%`}}/></div><small>{moduleCompleted}/{module.lessons.length} lesson</small></div><div className="module-tags"><span>Live Preview</span><span>Quiz</span><span>{modulePercent}%</span></div></div><span className="module-arrow">→</span></Link></motion.div>;
    })}</div></section>)}
  </div>;
}
