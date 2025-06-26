// Summarizes Google Places reviews for display on the home page.
//
// - summarizeReviews - A function that calls the flow.
// - SummarizeReviewsInput - The input type for the summarizeReviews function.
// - SummarizeReviewsOutput - The return type for the summarizeReviews function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReviewsInputSchema = z.object({
  reviewText: z
    .string()
    .describe('The text of the restaurant reviews from Google Places.'),
});
export type SummarizeReviewsInput = z.infer<typeof SummarizeReviewsInputSchema>;

const SummarizeReviewsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the customer reviews, highlighting positive aspects.'),
});
export type SummarizeReviewsOutput = z.infer<typeof SummarizeReviewsOutputSchema>;

export async function summarizeReviews(input: SummarizeReviewsInput): Promise<SummarizeReviewsOutput> {
  return summarizeReviewsFlow(input);
}

const summarizeReviewsPrompt = ai.definePrompt({
  name: 'summarizeReviewsPrompt',
  input: {schema: SummarizeReviewsInputSchema},
  output: {schema: SummarizeReviewsOutputSchema},
  prompt: `You are an expert in summarizing customer reviews for restaurants.

  Given the following customer reviews from Google Places, create a concise summary (approximately 50 words) highlighting the most positive aspects of the restaurant that would attract new customers.

  Reviews:
  {{reviewText}}`,
});

const summarizeReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeReviewsFlow',
    inputSchema: SummarizeReviewsInputSchema,
    outputSchema: SummarizeReviewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeReviewsPrompt(input);
    return output!;
  }
);
