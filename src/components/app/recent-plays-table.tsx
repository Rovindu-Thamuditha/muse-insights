import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import type { SpotifyPlayHistory } from "@/lib/types";

export function RecentPlaysTable({ plays }: { plays: SpotifyPlayHistory[] }) {
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
        {plays.map(({ track, played_at }) => (
          <TableRow key={`${track.id}-${played_at}`}>
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
              {formatDistanceToNow(new Date(played_at), {
                addSuffix: true,
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
