import { RecentPlaysTable } from "@/components/app/recent-plays-table";
import { SmartInsight } from "@/components/app/smart-insight";
import { getRecentlyPlayed } from "@/lib/spotify";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  const recentPlays = await getRecentlyPlayed();

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto">
        <SmartInsight />
      </div>
      <RecentPlaysTable plays={recentPlays.items} />
    </div>
  );
}
