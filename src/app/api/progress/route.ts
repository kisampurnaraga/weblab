import { NextResponse } from "next/server";
import { getSession } from "@/lib/server/auth";
import { studentRepository } from "@/lib/server/sheets";
import type { ProgressState } from "@/lib/progress";

const empty: ProgressState = { completedLessons: [], quizScores: {}, xp: 0 };
export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await studentRepository.getProgress(session.studentId));
  } catch {
    return NextResponse.json(empty);
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const current = await studentRepository.getProgress(session.studentId).catch(() => empty);
    let next: ProgressState = current;

    if (body.type === "lesson_complete" && typeof body.lessonId === "string" && !current.completedLessons.includes(body.lessonId)) {
      next = {
        ...current,
        completedLessons: [...current.completedLessons, body.lessonId],
        xp: current.xp + 10,
        currentLesson: body.lessonId,
      };
    }

    if (body.type === "quiz" && typeof body.lessonId === "string" && Number.isFinite(body.score)) {
      const first = current.quizScores[body.lessonId] === undefined;
      next = {
        ...current,
        quizScores: { ...current.quizScores, [body.lessonId]: Number(body.score) },
        xp: current.xp + (first ? 50 : 0),
        currentLesson: body.lessonId,
      };
    }

    if (body.type === "project_select" && typeof body.projectId === "string") {
      const allowed = ["obby-logic", "mini-tycoon", "pet-care", "fashion-shop", "escape-quiz", "school-life"];
      if (!allowed.includes(body.projectId)) {
        return NextResponse.json({ error: "Pilihan project tidak valid" }, { status: 400 });
      }
      next = {
        ...current,
        selectedProject: body.projectId,
        projectSelectedAt: new Date().toISOString(),
      };
    }

    const saved = await studentRepository.saveProgress(session.studentId, next);
    await studentRepository
      .log(
        session.studentId,
        body.type || "progress",
        body.lessonId || body.projectId || "",
        body.type === "project_select" ? { projectId: body.projectId } : {}
      )
      .catch(() => true);

    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menyimpan progress" },
      { status: 500 }
    );
  }
}
