import { StatCard } from "@/components/app/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTopArtists, getRecentlyPlayed } from "@/lib/spotify";
import { Clock, Disc, Music, Users } from "lucide-react";
import { DailyMinutesChart } from "@/components/charts/daily-minutes-chart";
import { RecentPlaysTable } from "@/components/app/recent-plays-table";
import { ListeningByHourChart } from "@/components/charts/listening-by-hour-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { format, getHours, startOfDay } from "date-fns";
import type { SpotifyPlayHistory } from "@/lib/types";

function getStatsFromHistory(history: SpotifyPlayHistory[]) {
  const totalTimeMs = history.reduce(
    (acc, play) => acc + play.track.duration_ms,
    0
  );
  const totalMinutes = Math.floor(totalTimeMs / 60000);

  const artistCounts = history.reduce((acc, play) => {
    const artistName = play.track.artists[0]?.name || "Unknown Artist";
    acc[artistName] = (acc[artistName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostPlayedArtist =
    Object.keys(artistCounts).sort(
      (a, b) => artistCounts[b] - artistCounts[a]
    )[0] || "N/A";

  const totalTracks = history.length;
  const avgDuration =
    totalTracks > 0 ? totalMinutes / totalTracks : 0;

  return {
    totalMinutes,
    totalTracks,
    mostPlayedArtist,
    avgListeningDuration: avgDuration.toFixed(2),
  };
}

async function StatsContent({
  timeRange,
}: {
  timeRange: "short_term" | "medium_term" | "long_term";
}) {
  const [topArtists, recentPlays] = await Promise.all([
    getTopArtists(timeRange),
    getRecentlyPlayed(50), 
  ]);

  const stats = getStatsFromHistory(recentPlays.items);

  const topGenre = topArtists.items.flatMap((artist) => artist.genres).reduce((acc, genre) => {
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topGenreName = Object.keys(topGenre).sort((a,b) => topGenre[b] - topGenre[a])[0] || 'N/A';

  const dailyListeningData = recentPlays.items
    .reduce((acc, play) => {
      const date = format(startOfDay(new Date(play.played_at)), "yyyy-MM-dd");
      const minutes = play.track.duration_ms / 60000;
      const existing = acc.find((d) => d.date === date);
      if (existing) {
        existing.minutes += minutes;
      } else {
        acc.push({ date, minutes: minutes });
      }
      return acc;
    }, [] as { date: string; minutes: number }[])
    .map((d) => ({
      date: d.date,
      minutes: Math.round(d.minutes),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  const hourlyListeningData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    plays: 0,
  }));
  recentPlays.items.forEach((play) => {
    const hour = getHours(new Date(play.played_at));
    hourlyListeningData[hour].plays += 1;
  });

  return (
    <div className="grid gap-6 mt-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Time (Recent)"
          value={`${Math.floor(stats.totalMinutes / 60).toLocaleString()}h ${
            stats.totalMinutes % 60
          }m`}
          description={`Based on your last ${stats.totalTracks} tracks.`}
          icon={Clock}
        />
        <StatCard title="Top Genre" value={topGenreName} icon={Music} description={`Based on your ${timeRange.replace('_', ' ')} artists.`}/>
        <StatCard title="Tracks Played (Recent)" value={stats.totalTracks} icon={Disc} description="Based on your recent history."/>
        <StatCard title="Most Played Artist (Recent)" value={stats.mostPlayedArtist} icon={Users} description="Based on your recent history."/>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Listening</CardTitle>
             <CardDescription>
              Based on your last 50 played tracks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DailyMinutesChart data={dailyListeningData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Listening by Hour</CardTitle>
             <CardDescription>
              Based on your last 50 played tracks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListeningByHourChart data={hourlyListeningData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently Played</CardTitle>
          <CardDescription>Your most recently played tracks.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentPlaysTable plays={recentPlays.items.slice(0, 10)} />
        </CardContent>
      </Card>
    </div>
  );
}

export default async function OverviewPage() {
  const session = await getServerSession(authOptions);
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
