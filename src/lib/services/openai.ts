interface LeadAnalysisContext {
  leadData: string;
}

export async function analyzeLead(context: LeadAnalysisContext) {
  try {
    const response = await fetch('/api/analyze-leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leadData: context.leadData }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to analyze lead data');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to analyze lead data',
    };
  }
}
