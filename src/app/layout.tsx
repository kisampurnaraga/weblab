import type { Metadata } from "next";
import "./globals.css";
import "./auth.css";
import "./dashboard.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: { default: "webLab — Belajar Coding Interaktif", template: "%s | webLab" },
  description: "Platform pembelajaran coding dan AI berbasis praktik langsung untuk siswa dan pemula.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><AppShell>{children}</AppShell></body></html>;
}
