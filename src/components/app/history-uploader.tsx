"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, differenceInDays, parseISO } from "date-fns";
import { StatCard } from "./stat-card";
import { Calendar, Clock, Disc, Mic, Sparkles, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


type HistoryEntry = {
  endTime: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
};

type ProcessedStats = {
  totalMinutes: number;
  totalTracks: number;
  uniqueArtists: number;
  uniqueTracks: number;
  dailyAverage: number;
  longestStreak: number;
  yearlyData: { year: string; minutes: number }[];
  topArtists: { name: string; minutes: number }[];
  topTracks: { name: string; minutes: number }[];
  totalMinutesThisYear: number;
};

const processFiles = (files: File[]): Promise<HistoryEntry[]> => {
  return new Promise((resolve, reject) => {
    let combinedData: HistoryEntry[] = [];
    let filesProcessed = 0;

    if (files.length === 0) {
      resolve([]);
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          if (Array.isArray(content)) {
            combinedData = combinedData.concat(content);
          }
          filesProcessed++;
          if (filesProcessed === files.length) {
            resolve(combinedData);
          }
        } catch (error) {
          reject(new Error("Failed to parse JSON file."));
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file."));
      };
      reader.readAsText(file);
    });
  });
};

const calculateStats = (history: HistoryEntry[]): ProcessedStats => {
    if (history.length === 0) {
        return { totalMinutes: 0, totalTracks: 0, uniqueArtists: 0, uniqueTracks: 0, dailyAverage: 0, longestStreak: 0, yearlyData: [], topArtists: [], topTracks: [], totalMinutesThisYear: 0 };
    }

    let totalMinutes = 0;
    const artistPlaytime: { [name: string]: number } = {};
    const trackPlaytime: { [name: string]: number } = {};
    const dailyMinutes: { [date: string]: number } = {};
    const yearlyMinutes: { [year: string]: number } = {};
    const currentYear = new Date().getFullYear().toString();
    
    history.forEach(entry => {
        const minutes = entry.msPlayed / 60000;
        totalMinutes += minutes;

        // Date calculations
        const playedAt = new Date(entry.endTime);
        const year = playedAt.getFullYear().toString();
        const date = format(playedAt, "yyyy-MM-dd");

        // Totals
        artistPlaytime[entry.artistName] = (artistPlaytime[entry.artistName] || 0) + minutes;
        trackPlaytime[entry.trackName] = (trackPlaytime[entry.trackName] || 0) + minutes;
        dailyMinutes[date] = (dailyMinutes[date] || 0) + minutes;
        yearlyMinutes[year] = (yearlyMinutes[year] || 0) + minutes;
    });

    // Top Artists and Tracks
    const topArtists = Object.entries(artistPlaytime).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, minutes]) => ({ name, minutes: Math.round(minutes) }));
    const topTracks = Object.entries(trackPlaytime).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, minutes]) => ({ name, minutes: Math.round(minutes) }));

    // Yearly data for chart
    const yearlyData = Object.entries(yearlyMinutes).map(([year, minutes]) => ({ year, minutes: Math.round(minutes) })).sort((a,b) => parseInt(a.year) - parseInt(b.year));
    
    // Streak
    const sortedDates = Object.keys(dailyMinutes).sort((a, b) => differenceInDays(parseISO(b), parseISO(a)));
    let longestStreak = 0;
    let currentStreak = 0;
    if(sortedDates.length > 0) {
        longestStreak = 1;
        currentStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const day1 = parseISO(sortedDates[i-1]);
            const day2 = parseISO(sortedDates[i]);
            if (differenceInDays(day1, day2) === 1) {
                currentStreak++;
            } else {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 1;
            }
        }
        longestStreak = Math.max(longestStreak, currentStreak);
    }
    
    // Final stats
    const totalDays = Object.keys(dailyMinutes).length;
    const dailyAverage = totalDays > 0 ? totalMinutes / totalDays : 0;
    const totalMinutesThisYear = yearlyMinutes[currentYear] || 0;

    return {
        totalMinutes: Math.round(totalMinutes),
        totalTracks: history.length,
        uniqueArtists: Object.keys(artistPlaytime).length,
        uniqueTracks: Object.keys(trackPlaytime).length,
        dailyAverage: Math.round(dailyAverage),
        longestStreak,
        yearlyData,
        topArtists,
        topTracks,
        totalMinutesThisYear: Math.round(totalMinutesThisYear),
    };
};

export function HistoryUploader() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<ProcessedStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("spotifyHistory");
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        setHistory(parsedHistory);
        setStats(calculateStats(parsedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      localStorage.removeItem("spotifyHistory");
    } finally {
        setIsLoading(false);
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setProcessing(true);
    setError(null);
    try {
      const newHistory = await processFiles(acceptedFiles);
      setHistory(newHistory);
      setStats(calculateStats(newHistory));
      localStorage.setItem("spotifyHistory", JSON.stringify(newHistory));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/json": [".json"] },
  });

  const clearHistory = () => {
    localStorage.removeItem("spotifyHistory");
    setHistory([]);
    setStats(null);
  }

  if (isLoading) {
    return <Card><CardContent className="p-6">Loading history from your browser...</CardContent></Card>
  }

  if (!stats) {
    return (
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed  hover:border-primary hover:bg-muted/50 transition-colors ${isDragActive ? 'border-primary bg-muted/50' : 'bg-transparent'}`}
      >
        <CardContent className="p-10 flex flex-col items-center justify-center text-center">
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="font-semibold">
            {isDragActive ? "Drop the files here..." : "Drag & drop your StreamingHistory.json files here, or click to select"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Upload the files you downloaded from Spotify to get started.</p>
        </CardContent>
        {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
      </Card>
    );
  }


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Your All-Time Spotify Stats</CardTitle>
                <CardDescription>Based on the {history.length.toLocaleString()} tracks you've uploaded.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <StatCard title="Total Playtime" value={`${Math.floor(stats.totalMinutes / 60).toLocaleString()}h ${stats.totalMinutes % 60}m`} icon={Clock} description="Across all uploaded history" />
                    <StatCard title="Total Tracks Played" value={stats.totalTracks.toLocaleString()} icon={Disc} description={`${stats.uniqueTracks.toLocaleString()} unique tracks`} />
                    <StatCard title="Total Unique Artists" value={stats.uniqueArtists.toLocaleString()} icon={Mic} description="The different artists you love"/>

                    <StatCard title="Longest Listening Streak" value={`${stats.longestStreak} days`} icon={Calendar} description="Consecutive days with listening activity"/>
                    <StatCard title="Daily Average" value={`${stats.dailyAverage} min`} icon={TrendingUp} description="Average minutes listened per day"/>
                    <StatCard title="This Year's Playtime" value={`${Math.floor(stats.totalMinutesThisYear / 60).toLocaleString()}h ${stats.totalMinutesThisYear % 60}m`} icon={Sparkles} description={`In ${new Date().getFullYear()}`}/>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Listening by Year</CardTitle>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.yearlyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" />
                        <YAxis unit="h"
                          tickFormatter={(value) => (value / 60).toFixed(0)}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <p className="font-bold">{label}</p>
                                        <p className="text-sm text-muted-foreground">{`${Math.floor(payload[0].value / 60)}h ${payload[0].value % 60}m`}</p>
                                    </div>
                                );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Artists</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                           <TableRow>
                                <TableHead>Artist</TableHead>
                                <TableHead className="text-right">Playtime</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.topArtists.map(artist => (
                                <TableRow key={artist.name}>
                                    <TableCell className="font-medium">{artist.name}</TableCell>
                                    <TableCell className="text-right">{`${Math.floor(artist.minutes / 60)}h ${artist.minutes % 60}m`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Tracks</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Track</TableHead>
                                <TableHead className="text-right">Playtime</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.topTracks.map(track => (
                                <TableRow key={track.name}>
                                    <TableCell className="font-medium">{track.name}</TableCell>
                                    <TableCell className="text-right">{`${Math.floor(track.minutes / 60)}h ${track.minutes % 60}m`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Manage Data</CardTitle>
                <CardDescription>
                    Your listening history is stored in your browser. You can clear it here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" onClick={clearHistory}>Clear Uploaded History</Button>
            </CardContent>
        </Card>
    </div>
  );
}
