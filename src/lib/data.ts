// This file is now deprecated for user data. 
// User data will be fetched from the session.
// We will remove this file in a future step.

import { PlaceHolderImages } from './placeholder-images';
import type { User, Track, Artist, PlayHistory, ListeningStats, DailyListening, HourlyListening } from './types';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const user: User = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: getImage('user-avatar'),
};

export const topTracks: Track[] = [
  { id: '1', title: 'The Less I Know The Better', artist: 'Tame Impala', album: 'Currents', duration: 217, albumArtUrl: getImage('album-1') },
  { id: '2', title: 'Heat Waves', artist: 'Glass Animals', album: 'How to Be a Human Being', duration: 238, albumArtUrl: getImage('album-3') },
  { id: '3', title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', album: 'AM', duration: 272, albumArtUrl: getImage('album-4') },
  { id: '4', title: 'Reptilia', artist: 'The Strokes', album: 'Is This It', duration: 221, albumArtUrl: getImage('album-5') },
  { id: '5', title: 'Nights', artist: 'Frank Ocean', album: 'Blonde', duration: 307, albumArtUrl: getImage('album-6') },
  { id: '6', title: 'Borderline', artist: 'Tame Impala', album: 'The Slow Rush', duration: 277, albumArtUrl: getImage('album-2') },
  { id: '7', title: 'Gooey', artist: 'Glass Animals', album: 'ZABA', duration: 289, albumArtUrl: getImage('album-7') },
  { id: '8', title: "A Certain Romance", artist: "Arctic Monkeys", album: "Whatever People Say I Am, That's What I'm Not", duration: 331, albumArtUrl: getImage('album-8')}
];

export const topArtists: Artist[] = [
  { id: '1', name: 'Tame Impala', imageUrl: getImage('artist-1'), monthlyListeners: 35_123_456 },
  { id: '2', name: 'Glass Animals', imageUrl: getImage('artist-2'), monthlyListeners: 42_987_654 },
  { id: '3', name: 'Arctic Monkeys', imageUrl: getImage('artist-3'), monthlyListeners: 55_432_109 },
  { id: '4', name: 'The Strokes', imageUrl: getImage('artist-4'), monthlyListeners: 28_765_432 },
  { id: '5', name: 'Frank Ocean', imageUrl: getImage('artist-5'), monthlyListeners: 30_111_222 },
];

export const recentPlays: PlayHistory[] = [
  { track: topTracks[1], playedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString() },
  { track: topTracks[3], playedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString() },
  { track: topTracks[0], playedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString() },
  { track: topTracks[4], playedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
  { track: topTracks[6], playedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString() },
];

export const stats: ListeningStats = {
  totalMinutes: 78_432,
  topGenre: 'Indie Rock',
  newArtists: 42,
  decade: '2010s',
};

export const dailyListening: DailyListening[] = [
  { date: '2023-11-01', minutes: 120 }, { date: '2023-11-02', minutes: 180 },
  { date: '2023-11-03', minutes: 90 }, { date: '2023-11-04', minutes: 240 },
  { date: '2023-11-05', minutes: 150 }, { date: '2023-11-06', minutes: 210 },
  { date: '2023-11-07', minutes: 160 },
];

export const hourlyListening: HourlyListening[] = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  let plays;
  if (i >= 8 && i <= 11) plays = Math.floor(Math.random() * 20) + 10; // Morning peak
  else if (i >= 15 && i <= 18) plays = Math.floor(Math.random() * 30) + 15; // Afternoon peak
  else if (i >= 21 && i <= 23) plays = Math.floor(Math.random() * 25) + 5; // Late night
  else plays = Math.floor(Math.random() * 10) + 1;
  return { hour: `${hour}:00`, plays };
});
