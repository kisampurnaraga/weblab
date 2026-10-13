"use client";

import { useEffect, useState } from "react";
import HtmlCssPlayground from "@/components/HtmlCssPlayground";
import HtmlCssConceptVisual from "@/components/HtmlCssConceptVisual";
import { markLessonComplete, readProgress, saveQuizScore } from "@/lib/progress";
import type { HtmlCssLesson } from "@/data/htmlcss";

export default function HtmlCssLessonClient({ lesson, lessonId }: { lesson: HtmlCssLesson; lessonId: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [savedScore, setSavedScore] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [revealed, setRevealed] = useState<number[]>([]);
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

  const toggleCheckpoint = (index:number) => setRevealed(current => current.includes(index) ? current.filter(x=>x!==index) : [...current,index]);

  return <div className="lesson-grid">
    <article className="lesson-content deep-lesson">
      <div className="lesson-kicker">HTML & CSS · {lesson.duration}</div>
      <h1>{lesson.title}</h1>

      <section className="lesson-intro-card">
        <span className="eyebrow">Mulai dari situasi nyata</span>
        <p>{lesson.story}</p>
        <div className="why-box"><strong>Kenapa ini penting?</strong><p>{lesson.why}</p></div>
      </section>

      <section className="lesson-section"><h2>🎯 Setelah lesson ini kamu bisa...</h2><ul className="goal-list">{lesson.objectives.map(x => <li key={x}>{x}</li>)}</ul></section>

      <section className="lesson-section">
        <div className="section-title-row"><div><span className="eyebrow">Visualkan dulu</span><h2>Gambaran Konsep</h2></div></div>
        <HtmlCssConceptVisual visual={lesson.visual} />
      </section>

      <section className="lesson-section"><span className="eyebrow">Pahami, jangan hafal</span><h2>Konsep Inti</h2>{lesson.explanation.map((x,i) => <p key={i}>{x}</p>)}<div className="concept-point-grid">{lesson.concepts.map(point=><div className="concept-point" key={point.title}><strong>{point.title}</strong><p>{point.body}</p></div>)}</div></section>

      <section className="lesson-section"><span className="eyebrow">Cara berpikir developer</span><h2>Bedah Langkah demi Langkah</h2><div className="walkthrough-list">{lesson.walkthrough.map((step,i)=><div className="walkthrough-step" key={step.title}><span>{i+1}</span><div><strong>{step.title}</strong><p>{step.body}</p></div></div>)}</div></section>

      <section className="lesson-section code-teach-section"><span className="eyebrow">Contoh utuh</span><h2>Bandingkan Kode dan Hasilnya</h2><p className="muted">Baca kode dari atas ke bawah, lalu lihat Live Preview di sebelah kanan. Ubah satu hal kecil dan amati apa yang berubah.</p><div className="code-pair"><div><b>HTML</b><pre className="code-block"><code>{lesson.html}</code></pre></div><div><b>CSS</b><pre className="code-block"><code>{lesson.css}</code></pre></div></div></section>

      <section className="lesson-section checkpoint-card"><span className="eyebrow">Cek pemahaman sebelum tugas</span><h2>Bisa Jelaskan dengan Kata-katamu Sendiri?</h2><div className="checkpoint-list">{lesson.checkpoint.map((item,index)=><div className="checkpoint-item" key={item.question}><button onClick={()=>toggleCheckpoint(index)}><span>{index+1}</span>{item.question}<b>{revealed.includes(index)?"−":"+"}</b></button>{revealed.includes(index)&&<p><strong>Jawaban inti:</strong> {item.answer}</p>}</div>)}</div></section>

      <section className="lesson-section project-brief-card">
        <span className="eyebrow">Tugas Proyek Terarah</span>
        <h2>{lesson.project.title}</h2>
        <p>{lesson.project.brief}</p>
        <div className="project-scope-note"><strong>Bekal yang boleh dipakai:</strong> {lesson.project.uses.join(" · ")}</div>
        <div className="project-requirements-grid"><div><h3>Requirement wajib</h3><ul>{lesson.project.requirements.map(x=><li key={x}>{x}</li>)}</ul></div><div><h3>Proyek dianggap berhasil jika...</h3><ul>{lesson.project.successCriteria.map(x=><li key={x}>{x}</li>)}</ul></div></div>
        <details><summary>Butuh hint bertahap?</summary><ol>{lesson.hints.map(x => <li key={x}>{x}</li>)}</ol></details>
        {lesson.project.stretch&&<div className="stretch-challenge"><strong>⭐ Challenge opsional</strong><p>{lesson.project.stretch}</p></div>}
      </section>

      <section className="lesson-section quiz-card"><span className="eyebrow">Quiz Cepat</span><h2>{lesson.quiz.question}</h2><div className="quiz-options">{lesson.quiz.options.map((option,index)=><button key={option} className={`quiz-option ${selected===index?(correct?"correct":"wrong"):""}`} onClick={()=>submitQuiz(index)}>{String.fromCharCode(65+index)}. {option}</button>)}</div>{selected!==null&&<div className={`quiz-feedback ${correct?"ok":"bad"}`}><strong>{correct?"Benar!":"Belum tepat."}</strong> {lesson.quiz.explanation}</div>}{savedScore!==null&&<p className="muted">Nilai tersimpan di akun: {savedScore}/100</p>}</section>

      <button className="btn complete" disabled={syncing} onClick={finish}>{syncing?"Sinkronisasi...":complete?"✓ Lesson Selesai":"Tandai Lesson Selesai +10 XP"}</button>
    </article>
    <aside className="lesson-playground"><div className="sticky-panel"><HtmlCssPlayground initialHtml={lesson.html} initialCss={lesson.css} compact /></div></aside>
  </div>;
}
