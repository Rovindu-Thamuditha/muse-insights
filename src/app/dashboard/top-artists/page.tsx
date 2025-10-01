import { ArtistCard } from "@/components/app/artist-card";
import { topArtists } from "@/lib/data";

export default function TopArtistsPage() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {topArtists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  );
}
