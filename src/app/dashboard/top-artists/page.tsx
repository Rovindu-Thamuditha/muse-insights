import { ArtistCard } from "@/components/app/artist-card";
import { getTopArtists } from "@/lib/spotify";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function TopArtistsPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  
  const topArtists = await getTopArtists();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {topArtists.items.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  );
}
