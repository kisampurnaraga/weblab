export type ProgressState = {
  completedLessons: string[];
  quizScores: Record<string, number>;
  xp: number;
  currentLesson?: string;
};

const KEY = "weblab-progress-v1";

export function readProgress(): ProgressState {
  if (typeof window === "undefined") return { completedLessons: [], quizScores: {}, xp: 0 };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { completedLessons: [], quizScores: {}, xp: 0 };
    return JSON.parse(raw) as ProgressState;
  } catch {
    return { completedLessons: [], quizScores: {}, xp: 0 };
  }
}

export function writeProgress(next: ProgressState) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function markLessonComplete(id: string) {
  const current = readProgress();
  if (current.completedLessons.includes(id)) return current;
  const next = {
    ...current,
    completedLessons: [...current.completedLessons, id],
    xp: current.xp + 10,
    currentLesson: id,
  };
  writeProgress(next);
  return next;
}

export function saveQuizScore(id: string, score: number) {
  const current = readProgress();
  const previous = current.quizScores[id];
  const next = {
    ...current,
    quizScores: { ...current.quizScores, [id]: score },
    xp: previous === undefined ? current.xp + 50 : current.xp,
  };
  writeProgress(next);
  return next;
}
