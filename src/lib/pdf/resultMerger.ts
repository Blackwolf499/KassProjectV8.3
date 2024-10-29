import type { ExtractedData, MemberData, MemberFinancials } from '../types';

export function mergeResults(results: any[]): ExtractedData {
  const merged: ExtractedData = {
    members: [],
    financials: {
      byMember: [],
      overall: {
        totalSales: 0,
        totalRevenue: 0,
        sourceLocation: { page: 1, index: 0 }
      }
    },
    metadata: {
      extractionTimestamp: new Date().toISOString(),
      sourceLocation: { page: 1, index: 0 }
    }
  };

  const memberMap = new Map<string, MemberData>();
  const financialsMap = new Map<string, MemberFinancials>();

  results.forEach((result, index) => {
    if (!result) {
      console.warn(`Skipping empty result for segment ${index}`);
      return;
    }

    try {
      mergeMemberData(result.members, memberMap);
      mergeFinancialData(result.financials, merged);
      mergeTransactionData(result.transactions, financialsMap);
    } catch (error) {
      console.error(`Error merging data from segment ${index}:`, error);
    }
  });

  calculateFinalMetrics(financialsMap);

  merged.members = Array.from(memberMap.values());
  merged.financials.byMember = Array.from(financialsMap.values());

  return merged;
}

function mergeMemberData(
  members: MemberData[] | undefined,
  memberMap: Map<string, MemberData>
): void {
  if (!members) return;

  members.forEach(member => {
    if (!member?.id) return;
    
    if (!memberMap.has(member.id)) {
      memberMap.set(member.id, member);
    } else {
      const existing = memberMap.get(member.id)!;
      existing.performance = Math.max(existing.performance || 0, member.performance || 0);
      existing.totalSales = (existing.totalSales || 0) + (member.totalSales || 0);
    }
  });
}

function mergeFinancialData(
  financials: any,
  merged: ExtractedData
): void {
  if (!financials) return;

  merged.financials.overall.totalSales += financials.totalSales || 0;
  merged.financials.overall.totalRevenue += financials.totalRevenue || 0;
}

function mergeTransactionData(
  transactions: any[] | undefined,
  financialsMap: Map<string, MemberFinancials>
): void {
  if (!transactions) return;

  transactions.forEach(transaction => {
    if (!transaction?.amount) return;

    const memberId = transaction.memberId || 'unknown';
    if (!financialsMap.has(memberId)) {
      financialsMap.set(memberId, {
        memberId,
        totalSales: 0,
        transactions: [],
        summary: {
          totalRevenue: 0,
          averageTransaction: 0,
          sourceLocation: { page: 1, index: 0 }
        }
      });
    }

    const memberFinancials = financialsMap.get(memberId)!;
    memberFinancials.transactions.push(transaction);
    memberFinancials.totalSales += transaction.amount;
    memberFinancials.summary.totalRevenue += transaction.amount;
  });
}

function calculateFinalMetrics(financialsMap: Map<string, MemberFinancials>): void {
  financialsMap.forEach(memberFinancials => {
    if (memberFinancials.transactions.length > 0) {
      memberFinancials.summary.averageTransaction = 
        memberFinancials.summary.totalRevenue / memberFinancials.transactions.length;
    }
  });
}