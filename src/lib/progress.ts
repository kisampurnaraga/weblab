export type ProgressState = {
  completedLessons: string[];
  quizScores: Record<string, number>;
  xp: number;
  currentLesson?: string;
  selectedProject?: string;
  projectSelectedAt?: string;
  earnedRewards?: string[];
  completedExercises?: string[];
  completedChallenges?: string[];
};

export const EMPTY_PROGRESS: ProgressState = { completedLessons: [], quizScores: {}, xp: 0, earnedRewards: [], completedExercises: [], completedChallenges: [] };

async function requestProgress(method = "GET", body?: unknown): Promise<ProgressState> {
  const response = await fetch("/api/progress", {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (response.status === 401) {
    window.location.href = "/masuk";
    return EMPTY_PROGRESS;
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Progress belum dapat disinkronkan");
  }
  return response.json();
}

export const readProgress = () => requestProgress();
export const markLessonComplete = (lessonId: string) => requestProgress("POST", { type: "lesson_complete", lessonId });
export const saveQuizScore = (lessonId: string, score: number) => requestProgress("POST", { type: "quiz", lessonId, score });
export const submitExercise = (lessonId: string, moduleSlug: string, code: string, output: string) => requestProgress("POST", { type: "exercise_complete", lessonId, moduleSlug, code, output });
export const completeChallenge = (lessonId: string, moduleSlug: string, code: string, output: string) => requestProgress("POST", { type: "challenge_complete", lessonId, moduleSlug, code, output });
export const selectProject = (projectId: string) => requestProgress("POST", { type: "project_select", projectId });
