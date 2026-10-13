import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { studentRepository } from "@/lib/server/sheets";
import type { ProgressState } from "@/lib/progress";
import { validatePythonExercise } from "@/data/pythonPedagogy";
import { validateWebExercise } from "@/data/htmlCssValidation";

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
  } catch {
    return NextResponse.json(empty);
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const raw = await studentRepository.getProgress(session.studentId).catch(() => empty);
    const current: ProgressState = { ...empty, ...raw, earnedRewards: raw.earnedRewards || [], completedExercises: raw.completedExercises || [], completedChallenges: raw.completedChallenges || [] };
    let next: ProgressState = current;

    if (body.type === "lesson_complete" && typeof body.lessonId === "string") {
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
