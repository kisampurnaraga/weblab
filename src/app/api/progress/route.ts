import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { studentRepository } from "@/lib/server/sheets";
import type { ProgressState } from "@/lib/progress";
import { validatePythonExercise } from "@/data/pythonPedagogy";
import { validateWebExercise } from "@/data/htmlCssValidation";
import { getVibeLesson, vibeLessonId, vibeLessons } from "@/data/vibeMarketing";

const empty: ProgressState = { completedLessons: [], quizScores: {}, xp: 0, earnedRewards: [], completedExercises: [], completedChallenges: [] };
export const runtime = "nodejs";

function hasReward(current: ProgressState, rewardId: string) {
  return (current.earnedRewards || []).includes(rewardId);
}

function addReward(current: ProgressState, rewardId: string, xp: number): ProgressState {
  if (hasReward(current, rewardId)) return current;
  return { ...current, xp: Number(current.xp || 0) + xp, earnedRewards: [...(current.earnedRewards || []), rewardId] };
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const p = await studentRepository.getProgress(session.studentId);
    return NextResponse.json({ ...empty, ...p, earnedRewards: p.earnedRewards || [], completedExercises: p.completedExercises || [], completedChallenges: p.completedChallenges || [] });
  } catch (error) {
    console.error("Progress GET failed:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Gagal membaca progress dari Google Sheets. Coba lagi; data tidak direset." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const raw = await studentRepository.getProgress(session.studentId);
    const current: ProgressState = { ...empty, ...raw, earnedRewards: raw.earnedRewards || [], completedExercises: raw.completedExercises || [], completedChallenges: raw.completedChallenges || [] };
    let next: ProgressState = current;

    if (body.type === "vibe_sync") {
      // Reconcile historical lesson records with existing validated task/quiz
      // evidence. Reward IDs keep this operation idempotent.
      for (const lesson of vibeLessons) {
        const lessonId = vibeLessonId(lesson.slug);
        const taskDone = (next.completedExercises || []).includes(lessonId);
        const quizPassed = (next.quizScores[lessonId] || 0) >= 75;
        if (taskDone) next = addReward(next, "exercise:" + lessonId, 20);
        if (quizPassed) next = addReward(next, "quiz:" + lessonId, 50);
        if (taskDone && quizPassed) {
          if (!next.completedLessons.includes(lessonId)) {
            next = { ...next, completedLessons: [...next.completedLessons, lessonId] };
          }
          next = addReward(next, "lesson:" + lessonId, 10);
        }
      }
      if (JSON.stringify(next) === JSON.stringify(current)) return NextResponse.json(current);
    }

    // XII IPS: task content is recorded; only completeness is automatically checked.
    if (body.type === "vibe_task_complete") {
      const slug = typeof body.lessonId === "string" ? body.lessonId.replace("koding-kecerdasan-xii-ips/", "") : "";
      const lesson = getVibeLesson(slug);
      if (!lesson || body.lessonId !== vibeLessonId(slug)) return NextResponse.json({ error: "Materi XII IPS tidak ditemukan." }, { status: 400 });
      const prompt = typeof body.prompt === "string" ? body.prompt.trim().slice(0, 800) : "";
      const artifact = typeof body.artifact === "string" ? body.artifact.trim().slice(0, 1500) : "";
      const checks = Array.isArray(body.checks) ? body.checks : [];
      const requiredChecks = ["Prompt menyebut tujuan dan target pengguna", "Artefak saya revisi dan tidak berisi data sensitif", "Saya bisa menjelaskan hasil tanpa membaca jawaban AI"];
      if (prompt.length < 100 || artifact.length < lesson.minArtifactLength || artifact === lesson.artifactStarter.trim() || requiredChecks.some(x => !checks.includes(x))) {
        return NextResponse.json({ error: "Lengkapi prompt (minimal 100 karakter), tulis hasil yang berbeda dari contoh (minimal 110 karakter), lalu centang ketiga pemeriksaan." }, { status: 400 });
      }
      if (lesson.requiredWords.some(word => !artifact.toLowerCase().includes(word.toLowerCase()))) {
        return NextResponse.json({ error: "Hasil belum memuat unsur penting: " + lesson.requiredWords.join(", ") }, { status: 400 });
      }
      const previous = current.completedExercises || [];
      next = { ...current, completedExercises: previous.includes(body.lessonId) ? previous : [...previous, body.lessonId], currentLesson: body.lessonId,
        vibeSubmissions: { ...(current.vibeSubmissions || {}), [body.lessonId]: { prompt, artifact, submittedAt: new Date().toISOString() } } };
      next = addReward(next, "exercise:" + body.lessonId, 20);
    }

    // XII IPS quiz is graded on the server: the browser cannot submit its own score.
    if (body.type === "vibe_quiz") {
      const slug = typeof body.lessonId === "string" ? body.lessonId.replace("koding-kecerdasan-xii-ips/", "") : "";
      const lesson = getVibeLesson(slug);
      if (!lesson || body.lessonId !== vibeLessonId(slug) || !Number.isInteger(body.answer) || body.answer < 0 || body.answer >= lesson.quiz.options.length) {
        return NextResponse.json({ error: "Jawaban quiz tidak valid." }, { status: 400 });
      }
      const score = body.answer === lesson.quiz.answer ? 100 : 0;
      const previous = current.quizScores[body.lessonId] || 0;
      next = { ...current, quizScores: { ...current.quizScores, [body.lessonId]: Math.max(previous, score) }, currentLesson: body.lessonId };
      if (score === 100) next = addReward(next, "quiz:" + body.lessonId, 50);
    }


    // XII IPS: finish and grant +10 XP automatically when both task and quiz pass.
    if ((body.type === "vibe_task_complete" || body.type === "vibe_quiz") && typeof body.lessonId === "string") {
      const taskPassed = (next.completedExercises || []).includes(body.lessonId);
      const quizPassed = (next.quizScores[body.lessonId] || 0) >= 75;
      if (taskPassed && quizPassed && !next.completedLessons.includes(body.lessonId)) {
        next = { ...next, completedLessons: [...next.completedLessons, body.lessonId], currentLesson: body.lessonId };
        next = addReward(next, "lesson:" + body.lessonId, 10);
      }
    }

    if (body.type === "lesson_complete" && typeof body.lessonId === "string") {
      if (body.lessonId.startsWith("koding-kecerdasan-xii-ips/")) {
        return NextResponse.json({error:"Pertemuan XII IPS otomatis selesai setelah tugas dikirim dan quiz lulus."},{status:400});
      }
      if (!current.completedLessons.includes(body.lessonId)) {
        next = { ...current, completedLessons: [...current.completedLessons, body.lessonId], currentLesson: body.lessonId };
        next = addReward(next, `lesson:${body.lessonId}`, 10);
      }
    }

    if (body.type === "quiz" && typeof body.lessonId === "string" && Number.isFinite(body.score)) {
      const score = Math.max(0, Math.min(100, Number(body.score)));
      const previous = current.quizScores[body.lessonId];
      const best = previous === undefined ? score : Math.max(previous, score);
      next = { ...current, quizScores: { ...current.quizScores, [body.lessonId]: best }, currentLesson: body.lessonId };
      if (score >= 75 && (previous === undefined || previous < 75)) next = addReward(next, `quiz:${body.lessonId}`, 50);
    }

    if ((body.type === "exercise_complete" || body.type === "challenge_complete") && typeof body.lessonId === "string" && typeof body.moduleSlug === "string") {
      const code = typeof body.code === "string" ? body.code.slice(0, 12000) : "";
      const output = typeof body.output === "string" ? body.output.slice(0, 6000) : "";
      const verdict = validatePythonExercise(body.moduleSlug, code, output);
      if (!verdict.ok) return NextResponse.json({ error: verdict.message }, { status: 400 });

      if (body.type === "exercise_complete") {
        const already = (current.completedExercises || []).includes(body.lessonId);
        next = { ...current, completedExercises: already ? (current.completedExercises || []) : [...(current.completedExercises || []), body.lessonId], currentLesson: body.lessonId };
        next = addReward(next, `exercise:${body.lessonId}`, 20);
      } else {
        const already = (current.completedChallenges || []).includes(body.lessonId);
        next = { ...current, completedChallenges: already ? (current.completedChallenges || []) : [...(current.completedChallenges || []), body.lessonId], currentLesson: body.lessonId };
        next = addReward(next, `challenge:${body.lessonId}`, 30);
      }
    }

    if (body.type === "web_exercise_complete" && typeof body.lessonId === "string" && typeof body.moduleSlug === "string") {
      const html = typeof body.html === "string" ? body.html.slice(0, 16000) : "";
      const css = typeof body.css === "string" ? body.css.slice(0, 16000) : "";
      const verdict = validateWebExercise(body.moduleSlug, html, css);
      if (!verdict.ok) return NextResponse.json({ error: verdict.message }, { status: 400 });
      const already = (current.completedExercises || []).includes(body.lessonId);
      next = { ...current, completedExercises: already ? (current.completedExercises || []) : [...(current.completedExercises || []), body.lessonId], currentLesson: body.lessonId };
      next = addReward(next, `exercise:${body.lessonId}`, 20);
    }

    if (body.type === "project_select" && typeof body.projectId === "string") {
      const allowed = ["obby-logic", "mini-tycoon", "pet-care", "fashion-shop", "escape-quiz", "school-life"];
      if (!allowed.includes(body.projectId)) return NextResponse.json({ error: "Pilihan project tidak valid" }, { status: 400 });
      next = { ...current, selectedProject: body.projectId, projectSelectedAt: new Date().toISOString() };
    }

    const saved = await studentRepository.saveProgress(session.studentId, next);
    await studentRepository.log(session.studentId, body.type || "progress", body.lessonId || body.projectId || "", { moduleSlug: body.moduleSlug || "", xp: saved.xp || 0 }).catch(() => true);
    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal menyimpan progress" }, { status: 500 });
  }
}
