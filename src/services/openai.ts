import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `Data Relationships: Maintain relationships between related data fields, such as clerk IDs and corresponding sales records.

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

export async function processDocumentWithAI(text: string): Promise<any> {
  try {
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
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI processing error:', error);
    throw new Error('Failed to process document with OpenAI');
  }
}