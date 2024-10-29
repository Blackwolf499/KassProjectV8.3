import type { ExtractedData, ValidationResult, SourceLocation } from '../types';

export async function validateExtractedData(
  data: ExtractedData,
  rawTextMap: Map<number, string>
): Promise<ValidationResult> {
  const validationResults: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    verifiedFields: []
  };

  // Validate employee data
  validateField(
    data.employee,
    rawTextMap,
    data.employee.sourceLocation,
    'employee',
    validationResults
  );

  // Validate financial data
  if (data.financials) {
    validateField(
      data.financials.summary,
      rawTextMap,
      data.financials.summary.sourceLocation,
      'financial summary',
      validationResults
    );

    // Validate transactions
    data.financials.transactions.forEach((transaction, index) => {
      validateField(
        transaction,
        rawTextMap,
        transaction.sourceLocation,
        `transaction ${index + 1}`,
        validationResults
      );
    });

    // Verify total revenue matches sum of transactions
    const transactionSum = data.financials.transactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    if (transactionSum !== data.financials.summary.totalRevenue) {
      validationResults.warnings.push(
        `Transaction sum (${transactionSum}) doesn't match total revenue (${data.financials.summary.totalRevenue})`
      );
    }
  }

  return validationResults;
}

function validateField(
  field: any,
  rawTextMap: Map<number, string>,
  location: SourceLocation,
  fieldName: string,
  results: ValidationResult
) {
  const pageText = rawTextMap.get(location.page);
  if (!pageText) {
    results.errors.push(`Source page ${location.page} not found for ${fieldName}`);
    results.isValid = false;
    return;
  }

  // Verify numerical values maintain precision
  if (typeof field === 'number') {
    const regex = new RegExp(`\\b${field.toString()}\\b`);
    if (!regex.test(pageText)) {
      results.warnings.push(
        `Exact value ${field} not found in source text for ${fieldName}`
      );
    }
  }

  results.verifiedFields.push({
    name: fieldName,
    location: location,
    verified: true
  });
}