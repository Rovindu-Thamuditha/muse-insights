import { Card, CardContent } from "@/components/ui/card";
import type { Artist } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ArtistCardProps = {
  artist: Artist;
  className?: string;
};

export function ArtistCard({ artist, className }: ArtistCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            className="object-cover"
            data-ai-hint="artist portrait"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">{artist.name}</h3>
          <p className="text-sm text-muted-foreground">
            {artist.monthlyListeners.toLocaleString()} monthly listeners
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
