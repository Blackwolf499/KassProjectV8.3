import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Loader2 } from 'lucide-react';
import { OpenAI } from 'openai';
import type { ExtractedData } from '../types';

interface DataInsightsProps {
  data: ExtractedData;
}

interface Insight {
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  description: string;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const systemPrompt = `You are a financial data analyst. Analyze the provided JSON data and generate exactly 4 key insights.
Focus on:
1. Revenue trends and patterns
2. Member performance and statistics
3. Transaction patterns
4. Notable outliers or anomalies

For each insight, provide:
- type: "positive" | "negative" | "neutral" | "warning"
- title: A brief, clear headline
- description: A detailed explanation with specific numbers

Return the insights in this exact JSON format:
{
  "insights": [
    {
      "type": "type of insight",
      "title": "insight title",
      "description": "detailed description"
    }
  ]
}`;

async function analyzeData(data: ExtractedData): Promise<Insight[]> {
  try {
    // Clean and prepare the data for analysis
    const analysisData = {
      totalRevenue: data.financials.overall.totalRevenue,
      totalMembers: data.members.length,
      memberStats: data.financials.byMember.map(member => ({
        id: member.memberId,
        revenue: member.totalSales,
        transactionCount: member.transactions.length,
        averageTransaction: member.summary.averageTransaction
      })),
      transactionSummary: {
        total: data.financials.byMember.reduce(
          (sum, member) => sum + member.transactions.length, 
          0
        ),
        averageAmount: data.financials.overall.totalRevenue / 
          data.financials.byMember.reduce(
            (sum, member) => sum + member.transactions.length, 
            1
          )
      }
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Analyze this financial data and provide insights: ${JSON.stringify(analysisData)}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response received from AI model');
    }

    const result = JSON.parse(completion.choices[0].message.content);
    
    if (!result.insights || !Array.isArray(result.insights)) {
      throw new Error('Invalid response format from AI model');
    }

    return result.insights.map((insight: any) => ({
      type: insight.type as Insight['type'],
      title: insight.title,
      description: insight.description
    }));
  } catch (error) {
    console.error('Error analyzing data:', error);
    return [{
      type: 'warning',
      title: 'Analysis Error',
      description: error instanceof Error 
        ? `Unable to generate insights: ${error.message}`
        : 'Unable to generate insights at this time. Please try again later.'
    }];
  }
}

export const DataInsights: React.FC<DataInsightsProps> = ({ data }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    const fetchInsights = async () => {
      try {
        setLoading(true);
        const result = await analyzeData(data);
        
        if (mounted) {
          if (result.length === 1 && result[0].type === 'warning' && retryCount < maxRetries) {
            // Retry on error
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, retryDelay);
          } else {
            setInsights(result);
            setLoading(false);
          }
        }
      } catch (error) {
        if (mounted) {
          setInsights([{
            type: 'warning',
            title: 'Analysis Error',
            description: 'Failed to analyze the data. Please try again later.'
          }]);
          setLoading(false);
        }
      }
    };

    fetchInsights();

    return () => {
      mounted = false;
    };
  }, [data, retryCount]);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <Loader2 className="animate-spin" />
          <span>Generating insights{retryCount > 0 ? ` (Attempt ${retryCount + 1}/3)` : ''}...</span>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-100';
      case 'negative':
        return 'bg-red-50 border-red-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">AI-Generated Insights</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-center space-x-2 mb-2">
              {getInsightIcon(insight.type)}
              <h3 className="font-medium text-gray-900">{insight.title}</h3>
            </div>
            <p className="text-sm text-gray-600">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};