import { redirect } from "next/navigation";
import PythonCourseDashboard from "@/components/PythonCourseDashboard";
import { getSession } from "@/lib/server/auth";

export const metadata = { title: "Belajar Python" };

export default async function PythonCoursePage() {
  const session = await getSession();
  if (!session) redirect("/masuk?next=/belajar/python");
  return <PythonCourseDashboard studentName={session.nama} />;
}
