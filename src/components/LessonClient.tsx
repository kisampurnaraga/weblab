"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/types/course";
import PythonPlayground from "@/components/PythonPlayground";
import { markLessonComplete, readProgress, saveQuizScore } from "@/lib/progress";

export default function LessonClient({ lesson, lessonId }: { lesson: Lesson; lessonId: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [savedScore, setSavedScore] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const correct = selected === lesson.quiz.answer;

  useEffect(() => {
    const progress = readProgress();
    setComplete(progress.completedLessons.includes(lessonId));
    if (progress.quizScores[lessonId] !== undefined) setSavedScore(progress.quizScores[lessonId]);
  }, [lessonId]);

  const submitQuiz = (index: number) => {
    setSelected(index);
    const score = index === lesson.quiz.answer ? 100 : 0;
    saveQuizScore(lessonId, score);
    setSavedScore(score);
  };

  const finish = () => {
    markLessonComplete(lessonId);
    setComplete(true);
  };

  return (
    <div className="lesson-grid">
      <article className="lesson-content">
        <div className="lesson-kicker">Materi · {lesson.duration}</div>
        <h1>{lesson.title}</h1>
        <section className="lesson-section">
          <h2>🎯 Tujuan Belajar</h2>
          <ul>{lesson.objectives.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className="lesson-section">
          <h2>Konsep</h2>
          {lesson.explanation.map((p) => <p key={p}>{p}</p>)}
        </section>
        <section className="lesson-section">
          <h2>Contoh</h2>
          <pre className="code-block"><code>{lesson.exampleCode}</code></pre>
        </section>
        {lesson.predict && (
          <section className="lesson-section accent-card">
            <span className="eyebrow">Prediksi Output</span>
            <pre className="code-block"><code>{lesson.predict.code}</code></pre>
            <p><strong>{lesson.predict.question}</strong></p>
            <div className="choice-list">{lesson.predict.options.map((o, i) => <div className="choice-static" key={o}>{String.fromCharCode(65+i)}. {o}</div>)}</div>
            <details><summary>Lihat penjelasan</summary><p>{lesson.predict.explanation}</p></details>
          </section>
        )}
        {lesson.commonMistake && <section className="lesson-section warning-card"><h2>⚠️ Kesalahan Umum</h2><p>{lesson.commonMistake}</p></section>}
        {lesson.debug && (
          <section className="lesson-section warning-card">
            <h2>🐞 Debug Challenge</h2><p>{lesson.debug.instruction}</p>
            <pre className="code-block"><code>{lesson.debug.code}</code></pre>
          </section>
        )}
        <section className="lesson-section exercise-card">
          <span className="eyebrow">Latihan Wajib</span>
          <h2>{lesson.exercise.title}</h2>
          <p>{lesson.exercise.instruction}</p>
          <details><summary>Butuh hint?</summary><ol>{lesson.exercise.hints.map((h) => <li key={h}>{h}</li>)}</ol></details>
        </section>
        <section className="lesson-section quiz-card">
          <span className="eyebrow">Quiz Cepat</span>
          <h2>{lesson.quiz.question}</h2>
          <div className="quiz-options">
            {lesson.quiz.options.map((option, index) => (
              <button key={option} className={`quiz-option ${selected === index ? (correct ? "correct" : "wrong") : ""}`} onClick={() => submitQuiz(index)}>
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
          {selected !== null && <div className={`quiz-feedback ${correct ? "ok" : "bad"}`}><strong>{correct ? "Benar!" : "Belum tepat."}</strong> {lesson.quiz.explanation}</div>}
          {savedScore !== null && <p className="muted">Nilai tersimpan: {savedScore}/100</p>}
        </section>
        <button className="btn complete" onClick={finish}>{complete ? "✓ Lesson Selesai" : "Tandai Lesson Selesai +10 XP"}</button>
      </article>
      <aside className="lesson-playground">
        <div className="sticky-panel">
          <PythonPlayground initialCode={lesson.exercise.starterCode} compact />
        </div>
      </aside>
    </div>
  );
}
