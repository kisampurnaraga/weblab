import { notFound } from "next/navigation";
import Link from "next/link";
import LessonClient from "@/components/LessonClient";
import { getLesson, pythonModules } from "@/data/python";

export default async function LessonPage({ params }: { params: Promise<{ module: string; lesson: string }> }) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;
  const found = getLesson(moduleSlug, lessonSlug);
  if (!found) notFound();
  const { module, lesson } = found;
  const currentIndex = pythonModules.findIndex((m) => m.slug === module.slug);
  const prev = currentIndex > 0 ? pythonModules[currentIndex - 1] : undefined;
  const next = currentIndex < pythonModules.length - 1 ? pythonModules[currentIndex + 1] : undefined;
  return <div className="lesson-page">
    <div className="lesson-breadcrumb"><Link href="/belajar/python">Python</Link><span>/</span><span>Modul {module.order}</span><span>/</span><strong>{lesson.title}</strong></div>
    <LessonClient lesson={lesson} lessonId={`${module.slug}/${lesson.slug}`} moduleSlug={module.slug} />
    <div className="lesson-nav">{prev ? <Link href={`/belajar/python/${prev.slug}/${prev.lessons[0].slug}`}>← {prev.title}</Link> : <span/>}{next ? <Link href={`/belajar/python/${next.slug}/${next.lessons[0].slug}`}>{next.title} →</Link> : <Link href="/progress">Lihat Progress →</Link>}</div>
  </div>;
}
