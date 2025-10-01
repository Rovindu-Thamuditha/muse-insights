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
  if (!history || history.length === 0) {
    return {
      totalMinutes: 0,
      totalTracks: 0,
      mostPlayedArtist: "N/A",
    };
  }

  const totalTimeMs = history.reduce(
    (acc, play) => acc + play.track.duration_ms,
    0
  );
  const totalMinutes = Math.round(totalTimeMs / 60000);

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

  return {
    totalMinutes,
    totalTracks,
    mostPlayedArtist,
  };
}

async function TopItemsContent({
  timeRange,
}: {
  timeRange: "short_term" | "medium_term" | "long_term";
}) {
  const topArtists = await getTopArtists(timeRange);

  const topGenre = topArtists.items.flatMap((artist) => artist.genres).reduce((acc, genre) => {
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topGenreName = Object.keys(topGenre).sort((a,b) => topGenre[b] - topGenre[a])[0] || 'N/A';

  return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Top Genre" value={topGenreName} icon={Music} description={`Based on your ${timeRange.replace('_', ' ')} artists.`}/>
        {/* Other stats based on timeRange can go here */}
      </div>
  );
}

export default async function OverviewPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const recentPlays = await getRecentlyPlayed(50);
  const stats = getStatsFromHistory(recentPlays.items);

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">Overview</h1>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your listening stats based on the last 50 tracks played.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Listening Time"
                value={`${Math.floor(stats.totalMinutes / 60)}h ${
                  stats.totalMinutes % 60
                }m`}
                icon={Clock}
              />
              <StatCard title="Tracks Played" value={stats.totalTracks} icon={Disc} />
              <StatCard title="Most Played Artist" value={stats.mostPlayedArtist} icon={Users} />
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
        </CardContent>
      </Card>


      {/* Top Items Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Your Top Items</CardTitle>
              <CardDescription>
                Your top artists and genres based on different time periods.
              </CardDescription>
            </div>
            <Tabs defaultValue="4-weeks" className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="4-weeks">4 Weeks</TabsTrigger>
                <TabsTrigger value="6-months">6 Months</TabsTrigger>
                <TabsTrigger value="all-time">All Time</TabsTrigger>
              </TabsList>
              <TabsContent value="4-weeks" className="mt-4">
                <TopItemsContent timeRange="short_term" />
              </TabsContent>
              <TabsContent value="6-months" className="mt-4">
                <TopItemsContent timeRange="medium_term" />
              </TabsContent>
              <TabsContent value="all-time" className="mt-4">
                <TopItemsContent timeRange="long_term" />
              </TabsContent>
            </Tabs>
          </div>
        </CardHeader>
      </Card>


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
