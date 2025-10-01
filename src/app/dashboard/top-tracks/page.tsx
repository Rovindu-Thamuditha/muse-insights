import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTopTracks } from "@/lib/spotify";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";

export default async function TopTracksPage() {
  const topTracks = await getTopTracks();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Top Tracks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead>Track</TableHead>
              <TableHead className="hidden md:table-cell">Album</TableHead>
              <TableHead className="text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topTracks.items.map((track, index) => (
              <TableRow key={track.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Image
                      src={track.album.images[0]?.url}
                      alt={track.album.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                      data-ai-hint="album cover"
                    />
                    <div className="grid gap-0.5">
                      <p className="font-medium truncate">{track.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.artists.map((a) => a.name).join(", ")}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {track.album.name}
                </TableCell>
                <TableCell className="text-right">
                  {formatDuration(track.duration_ms / 1000)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
