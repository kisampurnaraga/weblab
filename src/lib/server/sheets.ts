import type { ProgressState } from "@/lib/progress";

export type StudentRecord = {
  student_id: string; username: string; nama_lengkap: string; kelas: string; email: string;
  password_hash: string; status: "aktif" | "nonaktif"; created_at?: string; last_login_at?: string;
};

type BridgeResult<T> = { ok: boolean; data?: T; error?: string };

async function bridge<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const url = process.env.WEBLAB_SHEETS_API_URL;
  const secret = process.env.WEBLAB_SHEETS_SECRET;
  if (!url || !secret) throw new Error("Database Google Sheets belum dikonfigurasi di server");
  const response = await fetch(url, {
    method: "POST", headers: { "content-type": "application/json" }, cache: "no-store",
    body: JSON.stringify({ secret, action, ...payload }),
  });
  if (!response.ok) throw new Error(`Google Sheets bridge HTTP ${response.status}`);
  const json = await response.json() as BridgeResult<T>;
  if (!json.ok) throw new Error(json.error || "Operasi Google Sheets gagal");
  return json.data as T;
}

export const studentRepository = {
  findByUsername: (username: string) => bridge<StudentRecord | null>("findStudentByUsername", { username }),
  create: (student: StudentRecord) => bridge<StudentRecord>("createStudent", { student }),
  touchLogin: (studentId: string) => bridge<boolean>("touchLogin", { studentId }),
  getProgress: (studentId: string) => bridge<ProgressState>("getProgress", { studentId }),
  saveProgress: (studentId: string, progress: ProgressState) => bridge<ProgressState>("saveProgress", { studentId, progress }),
  log: (studentId: string, eventType: string, referenceId = "", metadata: Record<string, unknown> = {}) => bridge<boolean>("logActivity", { studentId, eventType, referenceId, metadata }),
};
