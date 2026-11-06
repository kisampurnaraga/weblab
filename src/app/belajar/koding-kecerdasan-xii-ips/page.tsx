import {redirect} from "next/navigation";
import VibeMarketingDashboard from "@/components/VibeMarketingDashboard";
import {getSession} from "@/lib/server/auth";
export const metadata={title:"Koding Kecerdasan XII IPS · Vibe Coding Digital Marketing"};
export default async function VibeMarketingCoursePage(){
 const session=await getSession();
 if(!session)redirect("/masuk?next=/belajar/koding-kecerdasan-xii-ips");
 return <VibeMarketingDashboard studentName={session.nama}/>;
}