import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { hashPassword, setSession } from "@/lib/server/auth";
import { studentRepository } from "@/lib/server/sheets";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nama = String(body.nama || "").trim();
    const username = String(body.username || "").trim().toLowerCase();
    const kelas = String(body.kelas || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (nama.length < 3 || !/^[a-z0-9._-]{4,30}$/.test(username) || kelas.length < 1 || password.length < 8) {
      return NextResponse.json({ error: "Data belum valid. Username minimal 4 karakter dan password minimal 8 karakter." }, { status: 400 });
    }
    if (await studentRepository.findByUsername(username)) return NextResponse.json({ error: "Username sudah digunakan." }, { status: 409 });
    const student = {
      student_id: `STU-${randomUUID().slice(0, 8).toUpperCase()}`, username, nama_lengkap: nama, kelas, email,
      password_hash: hashPassword(password), status: "aktif" as const, created_at: new Date().toISOString(),
    };
    await studentRepository.create(student);
    await setSession({ studentId: student.student_id, username, nama });
    await studentRepository.log(student.student_id, "register");
    return NextResponse.json({ ok: true, student: { studentId: student.student_id, username, nama, kelas } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registrasi gagal" }, { status: 500 });
  }
}
