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
import { topTracks } from "@/lib/data";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";

export default function TopTracksPage() {
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
            {topTracks.map((track, index) => (
              <TableRow key={track.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Image
                      src={track.albumArtUrl}
                      alt={track.album}
                      width={40}
                      height={40}
                      className="rounded-md"
                      data-ai-hint="album cover"
                    />
                    <div className="grid gap-0.5">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {track.album}
                </TableCell>
                <TableCell className="text-right">
                  {formatDuration(track.duration)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
