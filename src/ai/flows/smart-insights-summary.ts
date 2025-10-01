'use server';

/**
 * @fileOverview Provides a personalized monthly summary of a user's listening habits.
 *
 * - `generateSmartInsightsSummary`: Generates a short, personalized summary of a user's monthly listening habits.
 * - `SmartInsightsSummaryInput`: The input type for the `generateSmartInsightsSummary` function.
 * - `SmartInsightsSummaryOutput`: The return type for the `generateSmartInsightsSummary` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartInsightsSummaryInputSchema = z.object({
  monthlyListeningData: z
    .string()
    .describe(
      'A detailed JSON string containing the user’s listening data for the month, including total minutes listened, top tracks, top artists, top genres, and listening distribution across the month.'
    ),
  userProfile: z
    .string()
    .describe(
      'A JSON string containing the user’s profile information, including their username, join date, and any available demographic data.'
    ),
});
export type SmartInsightsSummaryInput = z.infer<typeof SmartInsightsSummaryInputSchema>;

const SmartInsightsSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A short, personalized summary of the user’s listening habits for the month, highlighting key trends and discoveries.'
    ),
});
export type SmartInsightsSummaryOutput = z.infer<typeof SmartInsightsSummaryOutputSchema>;

export async function generateSmartInsightsSummary(
  input: SmartInsightsSummaryInput
): Promise<SmartInsightsSummaryOutput> {
  return smartInsightsSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartInsightsSummaryPrompt',
  input: {schema: SmartInsightsSummaryInputSchema},
  output: {schema: SmartInsightsSummaryOutputSchema},
  prompt: `You are an AI music analyst providing personalized monthly summaries of users\' listening habits.

  Analyze the user\'s listening data and profile to create a concise and engaging summary of their musical trends and discoveries for the month.
  Highlight key trends, top tracks, artists, and genres, and any notable changes or patterns in their listening behavior.

  User Profile: {{{userProfile}}}
  Listening Data: {{{monthlyListeningData}}}

  Summary:`,
});

const smartInsightsSummaryFlow = ai.defineFlow(
  {
    name: 'smartInsightsSummaryFlow',
    inputSchema: SmartInsightsSummaryInputSchema,
    outputSchema: SmartInsightsSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
