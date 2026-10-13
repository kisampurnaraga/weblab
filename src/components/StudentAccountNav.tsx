"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type StudentLite = { nama: string; username: string } | null;

export default function StudentAccountNav({ student }: { student: StudentLite }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (!student) {
    return (
      <div className="account-nav">
        <Link href="/masuk">Masuk</Link>
        <Link className="account-signup" href="/daftar">Daftar</Link>
      </div>
    );
  }

  const initial = student.nama.trim().charAt(0).toUpperCase() || "S";

  return (
    <div className="account-nav account-authenticated">
      <Link href="/progress" className="student-chip" aria-label={`Buka progress ${student.nama}`}>
        <span className="student-avatar">{initial}</span>
        <span className="student-meta">
          <strong>{student.nama}</strong>
          <small>@{student.username}</small>
        </span>
      </Link>
      <button className="logout-button" onClick={logout}>Keluar</button>
    </div>
  );
}
