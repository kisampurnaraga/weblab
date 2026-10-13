import Link from "next/link";
import type { ReactNode } from "react";
import StudentAccountNav from "@/components/StudentAccountNav";
import { getSession } from "@/lib/server/auth";

export default async function AppShell({ children }: { children: ReactNode }) {
  const session = await getSession();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark">w</span>
          webLab
        </Link>
        <nav className="topnav" aria-label="Navigasi utama">
          <Link href="/belajar">Belajar</Link>
          <Link href="/playground/python">Playground</Link>
          <Link href="/progress">Progress</Link>
        </nav>
        <StudentAccountNav student={session ? { nama: session.nama, username: session.username } : null} />
      </header>
      <main>{children}</main>
      <footer className="footer">webLab · Belajar coding lewat praktik nyata.</footer>
    </div>
  );
}
