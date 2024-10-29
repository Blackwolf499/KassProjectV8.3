import { OpenAI } from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// PDF Processing Schema
export const pdfProcessingPrompt = `
Data Relationships: Maintain relationships between related data fields, such as clerk IDs and corresponding sales records.

Traceability: Preserve source locations within the document to ensure traceability of the extracted data.

Handling Missing Data: Gracefully handle any missing or optional fields by either assigning default values or marking them clearly.

Data Consistency: Validate the consistency of data across different sections, ensuring there are no conflicts or discrepancies.

JSON Schema to Use:

{
  "Clerks": [
    {
      "clerk_id": "string",
      "clerk_name": "string",
      "total_sales": "number",
      "sales_records": [
        {
          "item_code": "string",
          "item_description": "string",
          "quantity_sold": "number",
          "amount": "number"
        }
      ]
    }
  ]
}

Use this schema as a guide to convert the document into JSON, ensuring a complete representation of all the original data points.`;

// Data Insights Schema
export const insightsAnalysisPrompt = `You are a financial data analyst. Analyze the provided JSON data and generate exactly 4 key insights.
Focus on:
1. Revenue trends and patterns
2. Member performance and statistics
3. Transaction patterns
4. Notable outliers or anomalies

For each insight, provide:
- type: "positive" | "negative" | "neutral" | "warning"
- title: A brief, clear headline
- description: A detailed explanation with specific numbers

Return the insights in this exact J