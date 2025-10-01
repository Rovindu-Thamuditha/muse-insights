'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a creative description for a playlist based on user's listening history.
 *
 * - generatePlaylistDescription - A function that takes listening history as input and returns a playlist description.
 * - GeneratePlaylistDescriptionInput - The input type for the generatePlaylistDescription function.
 * - GeneratePlaylistDescriptionOutput - The return type for the generatePlaylistDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlaylistDescriptionInputSchema = z.object({
  listeningHistory: z.string().describe('The user listening history.'),
});
export type GeneratePlaylistDescriptionInput = z.infer<
  typeof GeneratePlaylistDescriptionInputSchema
>;

const GeneratePlaylistDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('A creative description of the playlist.'),
});
export type GeneratePlaylistDescriptionOutput = z.infer<
  typeof GeneratePlaylistDescriptionOutputSchema
>;

export async function generatePlaylistDescription(
  input: GeneratePlaylistDescriptionInput
): Promise<GeneratePlaylistDescriptionOutput> {
  return generatePlaylistDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlaylistDescriptionPrompt',
  input: {schema: GeneratePlaylistDescriptionInputSchema},
  output: {schema: GeneratePlaylistDescriptionOutputSchema},
  prompt: `You are a creative copywriter specializing in music playlists.

  Based on the user's listening history, generate a creative and engaging description for their playlist.

  Listening History: {{{listeningHistory}}}

  Description:`,
});

const generatePlaylistDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePlaylistDescriptionFlow',
    inputSchema: GeneratePlaylistDescriptionInputSchema,
    outputSchema: GeneratePlaylistDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
