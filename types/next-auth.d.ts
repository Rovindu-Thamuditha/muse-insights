import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
  }
}
import SpotifyProvider from "next-auth/providers/spotify";

SpotifyProvider({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  authorization: "https://accounts.spotify.com/authorize?scope=user-read-email,user-top-read,user-read-recently-played",
})