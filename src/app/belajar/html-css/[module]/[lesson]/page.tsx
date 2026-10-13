import { notFound } from "next/navigation";
import Link from "next/link";
import HtmlCssLessonClient from "@/components/HtmlCssLessonClient";
import { getHtmlCssLesson, htmlCssModules } from "@/data/htmlcss";

export default async function HtmlCssLessonPage({params}:{params:Promise<{module:string;lesson:string}>}){
  const {module:moduleSlug,lesson:lessonSlug}=await params;
  const found=getHtmlCssLesson(moduleSlug,lessonSlug);
  if(!found) notFound();
  const {module,lesson}=found;
  const currentIndex=htmlCssModules.findIndex(m=>m.slug===module.slug);
  const prev=currentIndex>0?htmlCssModules[currentIndex-1]:undefined;
  const next=currentIndex<htmlCssModules.length-1?htmlCssModules[currentIndex+1]:undefined;
  return <div className="lesson-page">
    <div className="lesson-breadcrumb"><Link href="/belajar/html-css">HTML & CSS</Link><span>/</span><span>Modul {module.order}</span><span>/</span><strong>{lesson.title}</strong></div>
    <HtmlCssLessonClient lesson={lesson} lessonId={`html-css/${module.slug}/${lesson.slug}`} moduleSlug={module.slug} />
    <div className="lesson-nav">{prev?<Link href={`/belajar/html-css/${prev.slug}/${prev.lessons[0].slug}`}>← {prev.title}</Link>:<span/>}{next?<Link href={`/belajar/html-css/${next.slug}/${next.lessons[0].slug}`}>{next.title} →</Link>:<Link href="/progress">Lihat Progress →</Link>}</div>
  </div>;
}
