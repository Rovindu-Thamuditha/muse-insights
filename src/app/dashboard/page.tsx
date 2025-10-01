import { StatCard } from "@/components/app/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTopArtists, getTopTracks, getRecentlyPlayed } from "@/lib/spotify";
import { Clock, Disc, Music, Users } from "lucide-react";
import { DailyMinutesChart } from "@/components/charts/daily-minutes-chart";
import { RecentPlaysTable } from "@/components/app/recent-plays-table";
import { ListeningByHourChart } from "@/components/charts/listening-by-hour-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { addDays, format, getHours, startOfDay } from "date-fns";

async function getStats(timeRange: "short_term" | "medium_term" | "long_term") {
  const topTracks = await getTopTracks(timeRange);
  const topArtists = await getTopArtists(timeRange);

  const totalTime = topTracks.items.reduce((acc, track) => acc + track.duration_ms, 0);
  const totalMinutes = Math.floor(totalTime / 1000 / 60);

  const genres = topArtists.items.flatMap(artist => artist.genres);
  const topGenre = genres.reduce((acc, genre) => {
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topGenreName = Object.keys(topGenre).sort((a, b) => topGenre[b] - topGenre[a])[0] || 'N/A';
  
  return {
    totalMinutes,
    topGenre: topGenreName,
    newArtists: 0, // Placeholder
    decade: "2020s", // Placeholder
  };
}

async function StatsContent({ timeRange }: { timeRange: "short_term" | "medium_term" | "long_term" }) {
  const [stats, recentPlays] = await Promise.all([
    getStats(timeRange),
    getRecentlyPlayed(50) // Fetch more for better charts
  ]);

  const dailyListeningData = recentPlays.items.reduce((acc, play) => {
    const date = format(new Date(play.played_at), "yyyy-MM-dd");
    const minutes = play.track.duration_ms / 60000;
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.minutes += minutes;
    } else {
      acc.push({ date, minutes });
    }
    return acc;
  }, [] as { date: string, minutes: number[] }[])
  .map(d => ({ date: d.date, minutes: Math.round(d.minutes.reduce((a, b) => a + b, 0)) }))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const hourlyListeningData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    plays: 0,
  }));
  recentPlays.items.forEach(play => {
    const hour = getHours(new Date(play.played_at));
    hourlyListeningData[hour].plays += 1;
  });


  return (
    <div className="grid gap-6 mt-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Time"
          value={`${Math.floor(stats.totalMinutes / 60).toLocaleString()}h ${
            stats.totalMinutes % 60
          }m`}
          icon={Clock}
        />
        <StatCard title="Top Genre" value={stats.topGenre} icon={Music} />
        <StatCard title="New Artists" value={stats.newArtists} icon={Users} />
        <StatCard title="Top Decade" value={stats.decade} icon={Disc} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Listening</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyMinutesChart data={dailyListeningData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Listening by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ListeningByHourChart data={hourlyListeningData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently Played</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentPlaysTable plays={recentPlays.items.slice(0, 20)} />
        </CardContent>
      </Card>
    </div>
  );
}


export default async function OverviewPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  return (
    <Tabs defaultValue="4-weeks">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl">Overview</h1>
        <TabsList>
          <TabsTrigger value="4-weeks">4 Weeks</TabsTrigger>
          <TabsTrigger value="6-months">6 Months</TabsTrigger>
          <TabsTrigger value="all-time">All Time</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="4-weeks">
        <StatsContent timeRange="short_term" />
      </TabsContent>
      <TabsContent value="6-months">
        <StatsContent timeRange="medium_term" />
      </TabsContent>
      <TabsContent value="all-time">
        <StatsContent timeRange="long_term" />
      </TabsContent>
    </Tabs>
  );
}
