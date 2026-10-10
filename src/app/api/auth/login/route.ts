import { NextResponse } from "next/server";
import { setSession, verifyPassword } from "@/lib/server/auth";
import { studentRepository } from "@/lib/server/sheets";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");
    const student = await studentRepository.findByUsername(username);
    if (!student || student.status !== "aktif" || !verifyPassword(password, student.password_hash)) {
      return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
    }
    await setSession({ studentId: student.student_id, username: student.username, nama: student.nama_lengkap });
    await Promise.allSettled([studentRepository.touchLogin(student.student_id), studentRepository.log(student.student_id, "login")]);
    return NextResponse.json({ ok: true, student: { studentId: student.student_id, username: student.username, nama: student.nama_lengkap, kelas: student.kelas } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login gagal" }, { status: 500 });
  }
}
