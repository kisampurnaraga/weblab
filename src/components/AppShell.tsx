import Link from "next/link";
import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link href="/" className="brand"><span className="brand-mark">w</span>webLab</Link>
        <nav className="topnav" aria-label="Navigasi utama">
          <Link href="/belajar">Belajar</Link>
          <Link href="/playground/python">Playground</Link>
          <Link href="/progress">Progress</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">webLab · Belajar coding lewat praktik nyata.</footer>
    </div>
  );
}
