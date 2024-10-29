import OpenAI from 'openai';
import { APIError, ProcessingError } from '../../errors';
import { retry } from '../../utils/retry';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `Process this document and extract structured data about sales and staff performance.
Format the response as a valid JSON object with this structure:
{
  "members": [{
    "id": "string",
    "name": "string",
    "performance": number,
    "totalSales": number
  }],
  "financials": {
    "totalRevenue": number,
    "totalSales": number,
    "averageTransaction": number
  }
}`;

export async function processDocumentWithAI(text: string): Promise<any> {
  if (!text.trim()) {
    throw new ProcessingError('Empty text provided', 'INVALID_INPUT');
  }

  try {
    return await retry(async () => {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      if (!completion.choices[0]?.message?.content) {
        throw new ProcessingError('Empty response from AI', 'EMPTY_RESPONSE');
      }

      try {
        return JSON.parse(completion.choices[0].message.content);
      } catch (parseError) {
        throw new ProcessingError(
          'Invalid JSON response from AI',
          'INVALID_RESPONSE',
          { originalError: parseError }
        );
      }
    });
  } catch (error) {
    if (error instanceof ProcessingError) {
      throw error;
    }

    if (error instanceof Error && 'status' in error) {
      const statusCode = (error as any).status;
      throw new APIError(
        error.message,
        statusCode,
        { originalError: error }
      );
    }

    throw new ProcessingError(
      'Failed to process document with AI',
      'AI_PROCESSING_FAILED',
      { originalError: error }
    );
  }
}