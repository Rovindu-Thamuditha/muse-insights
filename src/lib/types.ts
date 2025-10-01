// Deprecated types. Will be removed in a future step.
export type User = {
  name: string;
  email: string;
  avatarUrl: string;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  albumArtUrl: string;
};

export type Artist = {
  id: string;
  name: string;
  imageUrl: string;
  monthlyListeners: number;
};

export type PlayHistory = {
  track: Track;
  playedAt: string; // ISO string
};

export type ListeningStats = {
  totalMinutes: number;
  topGenre: string;
  newArtists: number;
  decade: string;
};

export type DailyListening = {
  date: string; // "YYYY-MM-DD"
  minutes: number;
};

export type HourlyListening = {
  hour: string; // "00" to "23"
  plays: number;
};

// Spotify API Types
interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyFollowers {
  href: string | null;
  total: number;
}

interface SpotifyBaseObject {
  id: string;
  name: string;
  uri: string;
  href: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyArtist extends SpotifyBaseObject {
  followers: SpotifyFollowers;
  genres: string[];
  images: SpotifyImage[];
  popularity: number;
}

export interface SpotifyTrack extends SpotifyBaseObject {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  preview_url: string | null;
}

export interface SpotifyAlbum extends SpotifyBaseObject {
  album_type: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
}

export interface SpotifyPlayHistory {
  track: SpotifyTrack;
  played_at: string;
  context: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  };
}

export interface SpotifyPaginated<T> {
  href: string;
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}
