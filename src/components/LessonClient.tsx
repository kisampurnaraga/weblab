"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/types/course";
import PythonPlayground from "@/components/PythonPlayground";
import { completeChallenge, markLessonComplete, readProgress, saveQuizScore, submitExercise } from "@/lib/progress";
import { pythonPedagogy } from "@/data/pythonPedagogy";

export default function LessonClient({ lesson, lessonId, moduleSlug }: { lesson: Lesson; lessonId: string; moduleSlug: string }) {
  const pedagogy = pythonPedagogy[moduleSlug];
  const [selected, setSelected] = useState<number | null>(null);
  const [savedScore, setSavedScore] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const [exerciseDone, setExerciseDone] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [code, setCode] = useState(lesson.exercise.starterCode);
  const [output, setOutput] = useState("");
  const [lastRunOk, setLastRunOk] = useState(false);
  const [taskMessage, setTaskMessage] = useState("");
  const correct = selected === lesson.quiz.answer;

  useEffect(() => {
    readProgress().then(p => {
      setComplete(p.completedLessons.includes(lessonId));
      setExerciseDone((p.completedExercises || []).includes(lessonId));
      setChallengeDone((p.completedChallenges || []).includes(lessonId));
      if (p.quizScores[lessonId] !== undefined) setSavedScore(p.quizScores[lessonId]);
    }).finally(() => setSyncing(false));
  }, [lessonId]);

  const submitQuiz = async (index: number) => {
    setSelected(index);
    const score = index === lesson.quiz.answer ? 100 : 0;
    const p = await saveQuizScore(lessonId, score);
    setSavedScore(p.quizScores[lessonId]);
  };

  const finishExercise = async () => {
    if (!lastRunOk) { setTaskMessage("Jalankan kode tanpa error terlebih dahulu, lalu cek latihan."); return; }
    setSyncing(true); setTaskMessage("");
    try {
      const p = await submitExercise(lessonId, moduleSlug, code, output);
      setExerciseDone((p.completedExercises || []).includes(lessonId));
      setTaskMessage("✓ Latihan tervalidasi. +20 XP masuk ke akunmu.");
    } catch (e) { setTaskMessage(e instanceof Error ? e.message : "Latihan belum lolos validasi."); }
    finally { setSyncing(false); }
  };

  const finishChallenge = async () => {
    if (!exerciseDone) { setTaskMessage("Selesaikan latihan wajib terlebih dahulu sebelum challenge."); return; }
    if (!lastRunOk) { setTaskMessage("Jalankan versi challenge tanpa error terlebih dahulu."); return; }
    setSyncing(true); setTaskMessage("");
    try {
      const p = await completeChallenge(lessonId, moduleSlug, code, output);
      setChallengeDone((p.completedChallenges || []).includes(lessonId));
      setTaskMessage("★ Challenge tercatat. +30 XP masuk ke akunmu.");
    } catch (e) { setTaskMessage(e instanceof Error ? e.message : "Challenge belum lolos validasi."); }
    finally { setSyncing(false); }
  };

  const finish = async () => {
    setSyncing(true);
    const p = await markLessonComplete(lessonId);
    setComplete(p.completedLessons.includes(lessonId));
    setSyncing(false);
  };

  return <div className="lesson-grid deep-lesson">
    <article className="lesson-content">
      <div className="lesson-kicker">Materi · {lesson.duration}</div>
      <h1>{lesson.title}</h1>

      {pedagogy && <>
        <section className="lesson-intro-card">
          <span className="eyebrow">Mulai dari situasi nyata</span>
          <p>{pedagogy.hook}</p>
          <div className="why-box"><strong>Analogi sederhana</strong><p>{pedagogy.analogy}</p></div>
          <div className="why-box" style={{marginTop:10}}><strong>Kenapa ini penting?</strong><p>{pedagogy.whyItMatters}</p></div>
        </section>

        <section className="lesson-section">
          <div className="section-title-row"><h2>🧠 Visual Konsep</h2><span className="muted">Lihat alurnya dulu</span></div>
          <div className="concept-visual">
            <div className={pedagogy.visual.flow ? "python-flow" : "python-concept-grid"}>
              {pedagogy.visual.items.map((item, index) => <div className="python-concept-node" key={item}><span>{index + 1}</span><strong>{item}</strong></div>)}
            </div>
            <p className="visual-caption">{pedagogy.visual.title}</p>
          </div>
        </section>
      </>}

      <section className="lesson-section"><h2>🎯 Tujuan Belajar</h2><ul>{lesson.objectives.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section className="lesson-section"><h2>Konsep Inti</h2>{lesson.explanation.map(p => <p key={p}>{p}</p>)}</section>

      {pedagogy && <section className="lesson-section">
        <h2>🔎 Pelajari langkah demi langkah</h2>
        <div className="walkthrough-list">{pedagogy.steps.map((step, i) => <div className="walkthrough-step" key={step}><span>{i + 1}</span><div><strong>Langkah {i + 1}</strong><p>{step}</p></div></div>)}</div>
      </section>}

      <section className="lesson-section"><h2>Contoh Kode</h2><pre className="code-block"><code>{lesson.exampleCode}</code></pre><p className="muted">Baca kode dari atas ke bawah. Sebelum menekan Run, coba prediksi hasilnya.</p></section>

      {lesson.predict && <section className="lesson-section accent-card"><span className="eyebrow">Prediksi Output</span><pre className="code-block"><code>{lesson.predict.code}</code></pre><p><strong>{lesson.predict.question}</strong></p><div className="choice-list">{lesson.predict.options.map((o,i)=><div className="choice-static" key={o}>{String.fromCharCode(65+i)}. {o}</div>)}</div><details><summary>Lihat penjelasan</summary><p>{lesson.predict.explanation}</p></details></section>}
      {lesson.commonMistake && <section className="lesson-section warning-card"><h2>⚠️ Kesalahan Umum</h2><p>{lesson.commonMistake}</p></section>}
      {lesson.debug && <section className="lesson-section warning-card"><h2>🐞 Debug Challenge</h2><p>{lesson.debug.instruction}</p><pre className="code-block"><code>{lesson.debug.code}</code></pre></section>}

      {pedagogy && <section className="lesson-section checkpoint-card">
        <span className="eyebrow">Cek Pemahaman</span><h2>Sebelum praktik, pastikan konsepnya masuk</h2>
        <div className="checkpoint-list">{pedagogy.checks.map((c,i)=><details className="checkpoint-item" key={c.question}><summary>{i+1}. {c.question}</summary><p>{c.answer}</p></details>)}</div>
      </section>}

      <section className="lesson-section exercise-card project-brief-card">
        <span className="eyebrow">Latihan Wajib · +20 XP</span>
        <h2>{lesson.exercise.title}</h2>
        <p>{pedagogy?.projectBrief || lesson.exercise.instruction}</p>
        {pedagogy && <div className="project-requirements-grid"><div><h3>Bekal yang dipakai</h3><ul>{pedagogy.steps.slice(0,3).map(x=><li key={x}>{x}</li>)}</ul></div><div><h3>Indikator berhasil</h3><ul>{pedagogy.successCriteria.map(x=><li key={x}>{x}</li>)}</ul></div></div>}
        <details><summary>Butuh hint?</summary><ol>{lesson.exercise.hints.map(h => <li key={h}>{h}</li>)}</ol></details>
        <button className="btn primary task-xp-button" disabled={syncing || exerciseDone} onClick={finishExercise}>{exerciseDone ? "✓ Latihan selesai · XP sudah masuk" : "Cek Latihan +20 XP"}</button>
      </section>

      {pedagogy && <section className="lesson-section stretch-challenge">
        <span className="eyebrow">Challenge Opsional · +30 XP</span><h2>Naikkan level project-mu</h2><p>{pedagogy.challenge}</p>
        <button className="btn ghost task-xp-button" disabled={syncing || challengeDone} onClick={finishChallenge}>{challengeDone ? "★ Challenge selesai · XP sudah masuk" : "Validasi Challenge +30 XP"}</button>
      </section>}

      {taskMessage && <div className={`task-message ${taskMessage.startsWith("✓") || taskMessage.startsWith("★") ? "ok" : "bad"}`}>{taskMessage}</div>}

      <section className="lesson-section quiz-card"><span className="eyebrow">Quiz Cepat · +50 XP jika lulus pertama kali</span><h2>{lesson.quiz.question}</h2><div className="quiz-options">{lesson.quiz.options.map((option,index)=><button key={option} className={`quiz-option ${selected===index?(correct?"correct":"wrong"):""}`} onClick={()=>submitQuiz(index)}>{String.fromCharCode(65+index)}. {option}</button>)}</div>{selected!==null&&<div className={`quiz-feedback ${correct?"ok":"bad"}`}><strong>{correct?"Benar!":"Belum tepat."}</strong> {lesson.quiz.explanation}</div>}{savedScore!==null&&<p className="muted">Nilai terbaik tersimpan di akun: {savedScore}/100</p>}</section>

      <button className="btn complete" disabled={syncing} onClick={finish}>{syncing?"Sinkronisasi...":complete?"✓ Lesson Selesai":"Tandai Lesson Selesai +10 XP"}</button>
    </article>

    <aside className="lesson-playground"><div className="sticky-panel"><PythonPlayground initialCode={lesson.exercise.starterCode} compact onCodeChange={setCode} onRunResult={(result)=>{setCode(result.code);setOutput(result.output);setLastRunOk(result.ok);}} /></div></aside>
  </div>;
}
