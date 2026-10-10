"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readProgress, type ProgressState } from "@/lib/progress";
import { pythonModules, totalLessons } from "@/data/python";

export default function ProgressClient() {
  const [progress, setProgress] = useState<ProgressState>({ completedLessons: [], quizScores: {}, xp: 0 });
  useEffect(() => setProgress(readProgress()), []);
  const percent = totalLessons ? Math.round((progress.completedLessons.length / totalLessons) * 100) : 0;
  const quizValues = Object.values(progress.quizScores);
  const quizAverage = quizValues.length ? Math.round(quizValues.reduce((a,b) => a+b, 0) / quizValues.length) : 0;

  return (
    <div className="container page-space">
      <div className="page-heading"><span className="eyebrow">Dashboard Siswa</span><h1>Progress Belajar</h1><p>Progress tersimpan di browser ini untuk fase awal webLab.</p></div>
      <div className="stats-grid">
        <div className="stat-card"><span>Progress Python</span><strong>{percent}%</strong><div className="progress"><span style={{width: `${percent}%`}} /></div></div>
        <div className="stat-card"><span>XP</span><strong>{progress.xp}</strong><small>Terus praktik untuk menambah XP</small></div>
        <div className="stat-card"><span>Lesson Selesai</span><strong>{progress.completedLessons.length}/{totalLessons}</strong><small>{pythonModules.length} modul tersedia</small></div>
        <div className="stat-card"><span>Rata-rata Quiz</span><strong>{quizAverage}%</strong><small>{quizValues.length} quiz dikerjakan</small></div>
      </div>
      <div className="section-head"><div><span className="eyebrow">Lanjut belajar</span><h2>Python Learning Path</h2></div><Link className="btn primary" href="/belajar/python">Buka Course</Link></div>
    </div>
  );
}
