import { OpenAI } from 'openai';
import type { PDFSegment } from '../types';
import { retryOperation } from './utils';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const systemPrompt = `You are a data extraction specialist. Analyze the provided document segment and extract structured data about sales and staff performance. The data must be complete and accurate.

Key requirements:
- Extract all staff member details including IDs, names, and metrics
- Capture all sales figures and revenue data
- Include all transaction details
- Maintain data integrity and relationships

Format the response as a valid JSON object with this structure:
{
  "members": [
    {
      "id": "string",
      "name": "string",
      "performance": number,
      "totalSales": number
    }
  ],
  "financials": {
    "totalRevenue": number,
    "totalSales": number,
    "averageTransaction": number
  },
  "transactions": [
    {
      "amount": number,
      "type": "string",
      "date": "string",
      "memberId": "string"
    }
  ]
}`;

export async function processSegment(
  segment: PDFSegment, 
  index: number, 
  totalSegments: number,
  signal?: AbortSignal
): Promise<any> {
  if (signal?.aborted) {
    throw new Error('Processing aborted');
  }

  return retryOperation(async () => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Process this document segment (${index + 1}/${totalSegments}): ${segment.text}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error(`Empty response from AI model for segment ${index + 1}`);
      }

      try {
        return JSON.parse(content);
      } catch (parseError) {
        throw new Error(`Invalid JSON response for segment ${index + 1}: ${parseError.message}`);
      }
    } catch (error) {
      console.error(`Error processing segment ${index + 1}:`, error);
      throw error;
    }
  });
}