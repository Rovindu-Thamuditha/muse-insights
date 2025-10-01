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
