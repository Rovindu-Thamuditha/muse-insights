"use client";

import { getSession } from "next-auth/react";
import { SpotifyPaginated, SpotifyTrack, SpotifyArtist } from "./types";

async function getAccessToken() {
  const session = await getSession();
  if (!session || !session.accessToken) {
    throw new Error("User not authenticated or access token missing");
  }
  return session.accessToken;
}

async function spotifyFetch(endpoint: string) {
  const accessToken = await getAccessToken();
  const url = `https://api.spotify.com/v1${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(`Spotify API Error: ${response.status} ${response.statusText}`, error);
    throw new Error(`Failed to fetch from Spotify: ${error.error?.message || response.statusText}`);
  }

  return response.json();
}

export async function getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit = 20): Promise<SpotifyPaginated<SpotifyTrack>> {
  return spotifyFetch(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
}

export async function getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit = 20): Promise<SpotifyPaginated<SpotifyArtist>> {
  return spotifyFetch(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
}
