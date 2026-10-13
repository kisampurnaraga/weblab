"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { pythonModules, totalLessons } from "@/data/python";

type ProgressState = {
  completedLessons: string[];
  quizScores: Record<string, number>;
  xp: number;
  currentLesson?: string;
};

const empty: ProgressState = { completedLessons: [], quizScores: {}, xp: 0 };

export default function PythonCourseDashboard({ studentName }: { studentName: string }) {
  const [progress, setProgress] = useState<ProgressState>(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : empty))
      .then((data) => setProgress({ ...empty, ...data }))
      .catch(() => setProgress(empty))
      .finally(() => setLoading(false));
  }, []);

  const lessonIndex = useMemo(() => {
    return pythonModules.flatMap((module) =>
      module.lessons.map((lesson) => ({
        id: lesson.slug,
        title: lesson.title,
        href: `/belajar/python/${module.slug}/${lesson.slug}`,
      })),
    );
  }, []);

  const completed = progress.completedLessons.length;
  const percent = Math.min(100, Math.round((completed / Math.max(totalLessons, 1)) * 100));
  const current = lessonIndex.find((lesson) => lesson.id === progress.currentLesson) ?? lessonIndex[0];
  const stages = Array.from(new Set(pythonModules.map((m) => m.stage)));

  return (
    <div className="container page-space student-course-dashboard">
      <motion.section
        className="student-welcome"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div>
          <span className="eyebrow">Ruang Belajar Siswa</span>
          <h1>Halo, {studentName} 👋</h1>
          <p>Lanjutkan progres Python kamu. Semua lesson, quiz, dan XP tersimpan ke akun ini.</p>
          <div className="student-dashboard-actions">
            <Link className="btn primary large" href={current?.href || "/belajar/python"}>
              {progress.currentLesson ? "Lanjutkan belajar" : "Mulai lesson pertama"} →
            </Link>
            <Link className="btn ghost large" href="/progress">Lihat progress lengkap</Link>
          </div>
        </div>
        <motion.div
          className="progress-orbit"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 130, damping: 18 }}
        >
          <div className="progress-ring" style={{ "--progress": `${percent * 3.6}deg` } as React.CSSProperties}>
            <div>
              <strong>{loading ? "…" : `${percent}%`}</strong>
              <span>selesai</span>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <section className="student-stat-grid" aria-label="Ringkasan progress">
        {[
          ["XP terkumpul", loading ? "…" : progress.xp, "⚡"],
          ["Lesson selesai", loading ? "…" : `${completed}/${totalLessons}`, "✓"],
          ["Quiz dikerjakan", loading ? "…" : Object.keys(progress.quizScores).length, "◆"],
          ["Track aktif", "Python", "Py"],
        ].map(([label, value, icon], index) => (
          <motion.div
            className="student-stat-card"
            key={String(label)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * index, duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.01 }}
          >
            <span className="stat-icon">{icon}</span>
            <small>{label}</small>
            <strong>{value}</strong>
          </motion.div>
        ))}
      </section>

      <motion.section
        className="course-hero course-hero-dashboard"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <div>
          <span className="eyebrow">Python Learning Track</span>
          <h2>Python dari Nol sampai Backend</h2>
          <p>Belajar logika, struktur data, debugging, OOP, API, dan database melalui praktik langsung.</p>
          <div className="course-meta">
            <span>{pythonModules.length} modul</span>
            <span>{totalLessons} lesson</span>
            <span>Pemula → Intermediate Dasar</span>
          </div>
        </div>
        <motion.div
          className="course-symbol big"
          animate={{ y: [0, -7, 0], rotate: [0, 1.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          Py
        </motion.div>
      </motion.section>

      {stages.map((stage, stageIndex) => (
        <motion.section
          className="module-stage"
          key={stage}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, delay: stageIndex * 0.03 }}
        >
          <div className="stage-title"><span>{stage}</span></div>
          <div className="module-list">
            {pythonModules.filter((m) => m.stage === stage).map((module, index) => {
              const first = module.lessons[0];
              const moduleCompleted = module.lessons.filter((lesson) => progress.completedLessons.includes(lesson.slug)).length;
              const modulePercent = Math.round((moduleCompleted / Math.max(module.lessons.length, 1)) * 100);

              return (
                <motion.div
                  key={module.slug}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.035 }}
                  whileHover={{ x: 5 }}
                >
                  <Link className="module-card module-card-dashboard" href={`/belajar/python/${module.slug}/${first.slug}`}>
                    <div className="module-num">{String(module.order).padStart(2, "0")}</div>
                    <div className="module-copy">
                      <div className="module-title-row">
                        <h3>{module.title}</h3>
                        {modulePercent === 100 && <span className="module-done">Selesai ✓</span>}
                      </div>
                      <p>{module.description}</p>
                      <div className="module-progress-row">
                        <div className="module-progress-track"><span style={{ width: `${modulePercent}%` }} /></div>
                        <small>{moduleCompleted}/{module.lessons.length} lesson</small>
                      </div>
                      <div className="module-tags"><span>Praktik</span><span>Quiz</span><span>{modulePercent}%</span></div>
                    </div>
                    <motion.span className="module-arrow" whileHover={{ x: 3 }}>→</motion.span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
