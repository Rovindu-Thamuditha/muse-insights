"use client";

import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md">
        <div className="bg-primary text-primary-foreground rounded-full p-4">
          <Music className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
          Muse Insights
        </h1>
        <p className="text-muted-foreground md:text-xl">
          Unlock your personal Spotify listening story. Dive deep into the
          tracks, artists, and genres that define your year in music.
        </p>
        <Button
          onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
          size="lg"
          className="font-semibold"
        >
          Log in with Spotify
        </Button>
      </div>
    </main>
  );
}
