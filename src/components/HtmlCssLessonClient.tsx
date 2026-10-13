"use client";

import { useEffect, useState } from "react";
import HtmlCssPlayground from "@/components/HtmlCssPlayground";
import { markLessonComplete, readProgress, saveQuizScore } from "@/lib/progress";
import type { HtmlCssLesson } from "@/data/htmlcss";

export default function HtmlCssLessonClient({ lesson, lessonId }: { lesson: HtmlCssLesson; lessonId: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [savedScore, setSavedScore] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const correct = selected === lesson.quiz.answer;

  useEffect(() => {
    readProgress().then(p => {
      setComplete(p.completedLessons.includes(lessonId));
      if (p.quizScores[lessonId] !== undefined) setSavedScore(p.quizScores[lessonId]);
    }).finally(() => setSyncing(false));
  }, [lessonId]);

  const submitQuiz = async (index: number) => {
    setSelected(index);
    const p = await saveQuizScore(lessonId, index === lesson.quiz.answer ? 100 : 0);
    setSavedScore(p.quizScores[lessonId]);
  };

  const finish = async () => {
    setSyncing(true);
    const p = await markLessonComplete(lessonId);
    setComplete(p.completedLessons.includes(lessonId));
    setSyncing(false);
  };

  return <div className="lesson-grid">
    <article className="lesson-content">
      <div className="lesson-kicker">HTML & CSS · {lesson.duration}</div>
      <h1>{lesson.title}</h1>
      <section className="lesson-section"><h2>🎯 Tujuan Belajar</h2><ul>{lesson.objectives.map(x => <li key={x}>{x}</li>)}</ul></section>
      <section className="lesson-section"><h2>Konsep</h2>{lesson.explanation.map(x => <p key={x}>{x}</p>)}</section>
      <section className="lesson-section"><h2>Contoh HTML</h2><pre className="code-block"><code>{lesson.html}</code></pre></section>
      <section className="lesson-section"><h2>Contoh CSS</h2><pre className="code-block"><code>{lesson.css}</code></pre></section>
      <section className="lesson-section exercise-card"><span className="eyebrow">Latihan Wajib</span><h2>Praktik Langsung</h2><p>{lesson.exercise}</p><details><summary>Butuh hint?</summary><ol>{lesson.hints.map(x => <li key={x}>{x}</li>)}</ol></details></section>
      <section className="lesson-section quiz-card"><span className="eyebrow">Quiz Cepat</span><h2>{lesson.quiz.question}</h2><div className="quiz-options">{lesson.quiz.options.map((option,index)=><button key={option} className={`quiz-option ${selected===index?(correct?"correct":"wrong"):""}`} onClick={()=>submitQuiz(index)}>{String.fromCharCode(65+index)}. {option}</button>)}</div>{selected!==null&&<div className={`quiz-feedback ${correct?"ok":"bad"}`}><strong>{correct?"Benar!":"Belum tepat."}</strong> {lesson.quiz.explanation}</div>}{savedScore!==null&&<p className="muted">Nilai tersimpan di akun: {savedScore}/100</p>}</section>
      <button className="btn complete" disabled={syncing} onClick={finish}>{syncing?"Sinkronisasi...":complete?"✓ Lesson Selesai":"Tandai Lesson Selesai +10 XP"}</button>
    </article>
    <aside className="lesson-playground"><div className="sticky-panel"><HtmlCssPlayground initialHtml={lesson.html} initialCss={lesson.css} compact /></div></aside>
  </div>;
}
