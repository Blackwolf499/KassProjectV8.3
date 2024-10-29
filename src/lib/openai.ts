import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOpenAICall<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0 && error instanceof Error) {
      console.warn(`OpenAI call failed, retrying... (${retries} attempts left)`);
      await delay(RETRY_DELAY);
      return retryOpenAICall(operation, retries - 1);
    }
    throw error;
  }
}

export async function analyzeDocument(text: string): Promise<string> {
  try {
    const response = await retryOpenAICall(async () => {
      return await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that analyzes documents and provides clear, concise summaries and insights."
          },
          {
            role: "user",
            content: `Please analyze the following document and provide a structured analysis with key metrics, insights, and recommendations:\n\n${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No analysis generated');
    }

    return content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to analyze document. Please try again.');
  }
}

export async function convertToStructuredData(text: string): Promise<any> {
  try {
    const response = await retryOpenAICall(async () => {
      return await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Convert the provided text into a structured format, organizing key information into appropriate categories."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      });
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No structured data generated');
    }

    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error('Invalid JSON response from OpenAI');
    }
  } catch (error) {
    console.error('OpenAI Conversion Error:', error);
    throw new Error('Failed to convert document to structured data');
  }
}