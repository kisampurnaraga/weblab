import {notFound} from "next/navigation";
import {getVibeLesson,vibeLessons} from "@/data/vibeMarketing";
import VibeMarketingLesson from "@/components/VibeMarketingLesson";
export function generateStaticParams(){return vibeLessons.map(lesson=>({lesson:lesson.slug}));}
export default async function VibeLessonPage({params}:{params:Promise<{lesson:string}>}){
 const {lesson:slug}=await params;
 const lesson=getVibeLesson(slug);
 if(!lesson)notFound();
 return <VibeMarketingLesson lesson={lesson}/>;
}