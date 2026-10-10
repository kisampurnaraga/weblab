export type ProgressState = { completedLessons: string[]; quizScores: Record<string, number>; xp: number; currentLesson?: string };
export const EMPTY_PROGRESS: ProgressState = { completedLessons: [], quizScores: {}, xp: 0 };

async function requestProgress(method = "GET", body?: unknown): Promise<ProgressState> {
  const response = await fetch("/api/progress", { method, headers: body ? { "content-type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  if (response.status === 401) { window.location.href = "/masuk"; return EMPTY_PROGRESS; }
  if (!response.ok) throw new Error("Progress belum dapat disinkronkan");
  return response.json();
}
export const readProgress = () => requestProgress();
export const markLessonComplete = (lessonId: string) => requestProgress("POST", { type: "lesson_complete", lessonId });
export const saveQuizScore = (lessonId: string, score: number) => requestProgress("POST", { type: "quiz", lessonId, score });
