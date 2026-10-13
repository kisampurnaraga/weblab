import { redirect } from "next/navigation";
import HtmlCssCourseDashboard from "@/components/HtmlCssCourseDashboard";
import { getSession } from "@/lib/server/auth";

export const metadata = { title: "Belajar HTML & CSS" };

export default async function HtmlCssCoursePage(){
  const session = await getSession();
  if(!session) redirect("/masuk?next=/belajar/html-css");
  return <HtmlCssCourseDashboard studentName={session.nama} />;
}
