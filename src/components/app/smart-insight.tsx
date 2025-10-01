"use client";

import { generateSmartInsightsSummary } from "@/ai/flows/smart-insights-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Wand2 } from "lucide-react";
import { useState, useTransition } from "react";
import { getTopArtists, getTopTracks } from "@/lib/spotify.client";
import { useSession } from "next-auth/react";

export function SmartInsight() {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleGenerateSummary = () => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "You need to be logged in to generate a summary.",
      });
      return;
    }
    startTransition(async () => {
      try {
        const [topTracks, topArtists] = await Promise.all([
          getTopTracks(),
          getTopArtists(),
        ]);

        const totalMinutes = topTracks.items.reduce((acc, track) => acc + track.duration_ms, 0) / 60000;

        const listeningData = {
          totalMinutes: Math.round(totalMinutes),
          topTracks: topTracks.items.slice(0, 5).map(t => ({ title: t.name, artist: t.artists.map(a => a.name).join(', ') })),
          topArtists: topArtists.items.slice(0, 3).map(a => a.name),
          listeningDistribution: "Not available" // Placeholder
        };

        const result = await generateSmartInsightsSummary({
          monthlyListeningData: JSON.stringify(listeningData, null, 2),
          userProfile: JSON.stringify({ username: session.user?.name, joinDate: "Not available" }, null, 2),
        });
        setSummary(result.summary);
      } catch (error) {
        console.error("Failed to generate summary:", error);
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Could not generate your listening summary. Please try again.",
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-primary" />
            <CardTitle>Your Monthly Smart Insight</CardTitle>
        </div>
        <CardDescription>
          Get a personalized summary of your listening habits this month, powered by AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        ) : summary ? (
          <p className="text-muted-foreground leading-relaxed">{summary}</p>
        ) : (
          <p className="text-muted-foreground">Click the button to generate your summary.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateSummary} disabled={isPending || !session}>
          <Wand2 className="mr-2 h-4 w-4" />
          {isPending ? "Generating..." : "Generate Summary"}
        </Button>
      </CardFooter>
    </Card>
  );
}
