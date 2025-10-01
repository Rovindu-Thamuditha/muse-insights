import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { recentPlays } from "@/lib/data";
import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export function RecentPlaysTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Track</TableHead>
          <TableHead className="hidden md:table-cell">Album</TableHead>
          <TableHead className="text-right">Played</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentPlays.map((play) => (
          <TableRow key={play.track.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <Image
                  src={play.track.albumArtUrl}
                  alt={play.track.album}
                  width={40}
                  height={40}
                  className="rounded-md"
                  data-ai-hint="album cover"
                />
                <div className="grid gap-0.5">
                  <p className="font-medium truncate">{play.track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {play.track.artist}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {play.track.album}
            </TableCell>
            <TableCell className="text-right">
              {formatDistanceToNow(new Date(play.playedAt), {
                addSuffix: true,
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
