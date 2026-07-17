'use server';

export interface AnalyzedEmailResult {
  category: 'action' | 'summarized';
  summaryText: string;
  suggestedReply: string;
}

/**
 * Analyzes email content using Google Gemini API or intelligent rule-based fallbacks.
 */
export async function analyzeEmailContentAction(
  subject: string,
  body: string
): Promise<AnalyzedEmailResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `Analyze the following email and return ONLY a valid JSON object with exactly these fields:
- "category": either "action" if the email requires action/response/review/urgent attention, or "summarized" if it is informational/newsletter/notification.
- "summaryText": a concise 1-2 sentence summary of the email (start with "Action Required: ..." if category is "action", or "Summarized: ..." if category is "summarized").
- "suggestedReply": a professional 1-2 sentence suggested response to the email.

Email Subject: ${subject}
Email Body: ${body}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const textContent =
          data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (textContent) {
          try {
            const parsed = JSON.parse(textContent);
            const category: 'action' | 'summarized' =
              parsed.category === 'action' ? 'action' : 'summarized';
            const summaryText: string =
              typeof parsed.summaryText === 'string' && parsed.summaryText.trim()
                ? parsed.summaryText.trim()
                : category === 'action'
                ? `Action Required: ${subject}`
                : `Summarized: ${subject}`;
            const suggestedReply: string =
              typeof parsed.suggestedReply === 'string' && parsed.suggestedReply.trim()
                ? parsed.suggestedReply.trim()
                : 'Thank you for the update. I will review this shortly.';

            return { category, summaryText, suggestedReply };
          } catch (parseError) {
            console.warn('[analyzeEmailContentAction JSON parse error, falling back]:', parseError);
          }
        }
      } else {
        console.warn('[analyzeEmailContentAction API non-OK status]:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('[analyzeEmailContentAction Error]:', error);
    }
  }

  // Intelligent rule-based fallback if no API key or API call fails
  const textToAnalyze = `${subject} ${body}`.toLowerCase();
  const actionKeywords = [
    'urgent',
    'review',
    'action required',
    'please approve',
    'deadline',
    'deliverable',
    'confirm',
    'need your input',
    'respond',
    'asap',
    'meeting',
    'schedule',
    'attention',
  ];

  const isAction = actionKeywords.some((keyword) => textToAnalyze.includes(keyword));
  const category: 'action' | 'summarized' = isAction ? 'action' : 'summarized';

  let summaryText = '';
  if (isAction) {
    summaryText = `Action Required: Please review "${subject}" and follow up on key deliverables.`;
  } else {
    summaryText = `Summarized: Informational update regarding "${subject}". No immediate action required.`;
  }

  let suggestedReply = '';
  if (isAction) {
    suggestedReply = `Hello, thank you for sending this over. I am reviewing the details for "${subject}" right now and will follow up with my notes shortly.`;
  } else {
    suggestedReply = `Thank you for the update regarding "${subject}". Received and noted.`;
  }

  return {
    category,
    summaryText,
    suggestedReply,
  };
}
