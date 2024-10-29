import { OpenAI } from 'openai';
import { AIError } from '../errors/AIError';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function processWithAI(content: string, systemPrompt: string): Promise<any> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new AIError('Empty response from AI');
    }

    try {
      return JSON.parse(result);
    } catch (error) {
      throw new AIError(`Invalid JSON response: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof AIError) {
      throw error;
    }
    throw new AIError(`OpenAI API Error: ${error.message}`);
  }
}