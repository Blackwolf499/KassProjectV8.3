export const documentAnalysisPrompt = `Analyze this document segment and extract structured data. Focus on:
- Member information (names, IDs, contact details)
- Financial data (sales, transactions, revenue)
- Document metadata (dates, periods)

Format the data according to this structure:
{
  "members": [
    {
      "id": "string",
      "name": "string",
      "contact": { "email": "string?", "phone": "string?" },
      "sourceLocation": { "page": number, "index": number }
    }
  ],
  "financials": {
    "byMember": [
      {
        "memberId": "string",
        "totalSales": number,
        "transactions": [
          {
            "amount": number,
            "type": "string",
            "sourceLocation": { "page": number, "index": number }
          }
        ],
        "summary": {
          "totalRevenue": number,
          "averageTransaction": number,
          "sourceLocation": { "page": number, "index": number }
        }
      }
    ],
    "overall": {
      "totalSales": number,
      "totalRevenue": number,
      "sourceLocation": { "page": number, "index": number }
    }
  }
}`;