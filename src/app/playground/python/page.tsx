import Link from "next/link";
import PythonPlayground from "@/components/PythonPlayground";
import { projectWorkspaces } from "@/data/projectArena";

export const metadata = { title: "Python Playground" };

type Props = {
  searchParams: Promise<{ project?: string }>;
};

export default async function PlaygroundPage({ searchParams }: Props) {
  const params = await searchParams;
  const project = params.project ? projectWorkspaces[params.project] : null;

  if (!project) {
    return (
      <div className="container page-space">
        <div className="page-heading">
          <span className="eyebrow">Sandbox</span>
          <h1>Python Playground</h1>
          <p>Eksperimen bebas. Kode berjalan di browser melalui Pyodide, bukan dieksekusi di server webLab.</p>
        </div>
        <PythonPlayground initialCode={'# Eksperimen Python di sini\nnama = "webLab"\nfor i in range(1, 4):\n    print(i, nama)'} />
      </div>
    );
  }

  return (
    <div className="container page-space">
      <div className="project-workspace-head">
        <div>
          <span className="eyebrow">Project Arena · {project.rewardXp} XP</span>
          <h1>{project.icon} {project.title}</h1>
          <p>{project.description}</p>
          <div className="course-meta">
            {project.concepts.map((concept) => <span key={concept}>{concept}</span>)}
          </div>
        </div>
        <Link href="/belajar/python" className="btn ghost">← Ganti Project</Link>
      </div>

      <div className="project-workspace-grid">
        <aside className="project-mission-panel">
          <span className="eyebrow">Misi Project</span>
          <h2>{project.subtitle}</h2>
          <p>Selesaikan checkpoint satu per satu. Ubah kode starter, jalankan, baca output, lalu lanjutkan sampai semua target terpenuhi.</p>
          <ol>
            {project.missions.map((mission, index) => (
              <li key={mission}>
                <span>{index + 1}</span>
                <div><strong>Checkpoint {index + 1}</strong><p>{mission}</p></div>
              </li>
            ))}
          </ol>
          <div className="accent-card project-reward-card">
            <strong>🏆 Reward penyelesaian</strong>
            <p>Target reward: <b>{project.rewardXp} XP</b>. Nanti reward diberikan setelah checkpoint project lolos verifikasi.</p>
          </div>
        </aside>

        <main className="project-code-panel">
          <div className="project-code-title">
            <div><span className="eyebrow">Workspace</span><h2>{project.title}.py</h2></div>
            <span className="badge success">Project aktif</span>
          </div>
          <PythonPlayground initialCode={project.starterCode} />
        </main>
      </div>
    </div>
  );
}
