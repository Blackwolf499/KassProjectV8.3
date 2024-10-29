export interface SourceLocation {
  page: number;
  index: number;
}

export interface MemberContact {
  email?: string;
  phone?: string;
}

export interface MemberData {
  id: string;
  name: string;
  contact?: MemberContact;
  sourceLocation: SourceLocation;
}

export interface Transaction {
  amount: number;
  type: string;
  sourceLocation: SourceLocation;
}

export interface MemberFinancials {
  memberId: string;
  totalSales: number;
  transactions: Transaction[];
  summary: {
    totalRevenue: number;
    averageTransaction: number;
    sourceLocation: SourceLocation;
  };
}

export interface ExtractedData {
  members: MemberData[];
  financials: {
    byMember: MemberFinancials[];
    overall: {
      totalSales: number;
      totalRevenue: number;
      sourceLocation: SourceLocation;
    };
  };
  metadata: {
    documentDate?: string;
    reportPeriod?: string;
    extractionTimestamp: string;
    sourceLocation: SourceLocation;
  };
}

export interface ProcessingStatus {
  isLoading: boolean;
  error: string | null;
  progress: number;
}

export interface PDFSegment {
  text: string;
  pageRange: {
    start: number;
    end: number;
  };
  segmentIndex: number;
  startPosition: number;
}