import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { OpenAI } from 'openai';
import type { ExtractedData } from '../types';

// Set worker source
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function processFullDocument(
  file: File,
  onProgress: (progress: number) => void
): Promise<ExtractedData> {
  try {
    onProgress(10);
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    
    onProgress(30);
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items
        .map((item: any) => item.str)
        .join(' ') + '\n';
      
      onProgress(30 + (i / pdf.numPages) * 30);
    }

    onProgress(70);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Analyze this document and extract structured data about sales and staff performance. 
          Return the data in this exact JSON structure:
          {
            "members": [{
              "id": string,
              "name": string,
              "contact": {
                "email": string?,
                "phone": string?
              },
              "sourceLocation": { "page": number, "index": number }
            }],
            "financials": {
              "byMember": [{
                "memberId": string,
                "totalSales": number,
                "transactions": [{
                  "amount": number,
                  "type": string,
                  "sourceLocation": { "page": number, "index": number }
                }],
                "summary": {
                  "totalRevenue": number,
                  "averageTransaction": number,
                  "sourceLocation": { "page": number, "index": number }
                }
              }],
              "overall": {
                "totalSales": number,
                "totalRevenue": number,
                "sourceLocation": { "page": number, "index": number }
              }
            },
            "metadata": {
              "documentDate": string?,
              "reportPeriod": string?,
              "extractionTimestamp": string
            }
          }`
        },
        {
          role: "user",
          content: fullText
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    onProgress(90);

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response received from AI');
    }

    const result = JSON.parse(completion.choices[0].message.content);
    
    if (!result.members || !result.financials || !result.metadata) {
      throw new Error('Invalid response structure from AI');
    }

    onProgress(100);
    return result;
  } catch (error) {
    console.error('Full document processing error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to process document');
  }
}