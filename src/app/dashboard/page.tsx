import { StatCard } from "@/components/app/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stats } from "@/lib/data";
import { Clock, Disc, Mic, Music, Users } from "lucide-react";
import { DailyMinutesChart } from "@/components/charts/daily-minutes-chart";
import { RecentPlaysTable } from "@/components/app/recent-plays-table";
import { ListeningByHourChart } from "@/components/charts/listening-by-hour-chart";

export default function OverviewPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Time"
          value={`${Math.floor(stats.totalMinutes / 60).toLocaleString()}h ${stats.totalMinutes % 60}m`}
          icon={Clock}
        />
        <StatCard title="Top Genre" value={stats.topGenre} icon={Music} />
        <StatCard
          title="New Artists"
          value={stats.newArtists}
          icon={Users}
        />
        <StatCard title="Top Decade" value={stats.decade} icon={Disc} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Listening</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyMinutesChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Listening by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ListeningByHourChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently Played</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentPlaysTable />
        </CardContent>
      </Card>
    </div>
  );
}
