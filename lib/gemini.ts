import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  ATSAnalysisResult,
  ParsedResume,
  RuleBasedATSScoring,
} from '@/types';

const JSON_SCHEMA: ATSAnalysisResult = {
  score: 0,
  skillsMatch: 0,
  missingKeywords: [],
  suggestions: { skills: [], experience: [], formatting: [], summary: [] },
  improvedSummary: '',
  improvedBulletExamples: [],
  strengths: [],
  weaknesses: [],
  sectionBreakdown: {},
  keywordDensity: {},
  atsWarnings: [],
};

function extractJSON(text: string): string {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];
  return trimmed;
}

export async function analyzeResumeWithAI(
  resumeText: string,
  jobDescription: string,
  parsed: ParsedResume,
  ruleBased: RuleBasedATSScoring,
  company: string | null,
  role: string | null
): Promise<ATSAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const genAI = new GoogleGenerativeAI(apiKey);
  // Model IDs can be deprecated/retired; prefer a supported alias by default.
  // - Prefer stable `v1` by default.
  // - Use a concrete model ID that exists on `v1` (aliases like `gemini-flash-latest`
  //   may only be available on `v1beta`).
  const modelId = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
  const apiVersion = (process.env.GEMINI_API_VERSION?.trim() ||
    'v1') as 'v1' | 'v1beta';

  // `responseMimeType` is not accepted by some models on the stable `v1` API.
  // Only include it on `v1beta` where it is supported.
  const generationConfig =
    apiVersion === 'v1beta'
      ? { temperature: 0.3, responseMimeType: 'application/json' as const }
      : { temperature: 0.3 };

  const model = genAI.getGenerativeModel(
    {
      model: modelId,
      generationConfig,
    },
    { apiVersion }
  );

  const systemPrompt = `You are a senior recruiter and ATS (Applicant Tracking System) that produces professional ATS reports. You are given:
- Parsed resume structure (sections, skills, education, experience, projects).
- The job description.
- Rule-based ATS scores that already combine keyword match, skills relevance, education, experience, projects, formatting and quantified achievements.

Your job:
- Keep the numeric scores roughly consistent with the provided rule-based scores (do NOT drastically change them).
- Focus on insight: strengths, weaknesses, missing skills, and actionable improvement suggestions.
- Respond with STRICT JSON only – no markdown, no prose outside JSON.`;

  const context = {
    company,
    role,
    jobDescription: jobDescription.slice(0, 4000),
    parsedResume: parsed,
    ruleBasedScores: ruleBased,
  };

  const userPrompt = `Using the following JSON context, produce a professional ATS review.

CONTEXT JSON:
${JSON.stringify(context)}

Return ONLY a single JSON object with this exact structure:
{
  "ATSScore": <number 0-100, aligned with ruleBasedScores.score>,
  "strengths": [<array of 3-7 concise strengths tailored to the role>],
  "weaknesses": [<array of 3-7 concise weaknesses or risks>],
  "missingKeywords": [<array of important skills/keywords that are low or missing, especially from ruleBasedScores.missingKeywords>],
  "resumeSummaryFeedback": "<1-2 short paragraphs critiquing the resume summary/profile section>",
  "experienceFeedback": "<1-2 short paragraphs critiquing work experience and quantified impact>",
  "skillsFeedback": "<1 paragraph critiquing the skills section coverage vs role requirements>",
  "formattingFeedback": "<1 paragraph about formatting and ATS compatibility>",
  "improvedSummarySuggestion": "<2-4 sentence rewritten professional summary optimized for this company and role>",
  "improvedBulletPoints": [<array of 3-6 high-impact, quantified bullet examples tailored to the role>],
  "skillGapAnalysis": [<array of 5-10 key gaps where the resume could better match the role>]
}`;

  const result = await model.generateContent(
    `${systemPrompt}\n\nUSER PROMPT:\n${userPrompt}`
  );
  const response = result.response;
  const content = response.text();
  if (!content) throw new Error('Empty response from Gemini');

  const raw = extractJSON(content);
  const ai = JSON.parse(raw) as {
    ATSScore?: number;
    strengths?: string[];
    weaknesses?: string[];
    missingKeywords?: string[];
    resumeSummaryFeedback?: string;
    experienceFeedback?: string;
    skillsFeedback?: string;
    formattingFeedback?: string;
    improvedSummarySuggestion?: string;
    improvedBulletPoints?: string[];
    skillGapAnalysis?: string[];
  };

  const combinedMissing = Array.from(
    new Set([...(ruleBased.missingKeywords ?? []), ...(ai.missingKeywords ?? [])])
  );

  return {
    ...JSON_SCHEMA,
    score: ruleBased.score,
    skillsMatch: ruleBased.skillsMatch,
    jobMatchScore: ruleBased.jobMatchScore,
    subScores: ruleBased.subScores,
    missingKeywords: combinedMissing,
    strengths: ai.strengths ?? [],
    weaknesses: ai.weaknesses ?? [],
    improvedSummary: ai.improvedSummarySuggestion ?? '',
    improvedBulletExamples: ai.improvedBulletPoints ?? [],
    resumeSummaryFeedback: ai.resumeSummaryFeedback,
    experienceFeedback: ai.experienceFeedback,
    skillsFeedback: ai.skillsFeedback,
    formattingFeedback: ai.formattingFeedback,
    skillGapAnalysis: ai.skillGapAnalysis ?? [],
    sectionBreakdown: ruleBased.sectionBreakdown,
    keywordDensity: ruleBased.keywordDensity,
    atsWarnings: ruleBased.atsWarnings,
    suggestions: {
      skills: (ai.skillGapAnalysis ?? []).slice(0, 10),
      experience: ai.experienceFeedback
        ? ai.experienceFeedback.split(/\n+/).filter(Boolean)
        : [],
      formatting: ai.formattingFeedback
        ? ai.formattingFeedback.split(/\n+/).filter(Boolean)
        : [],
      summary: ai.resumeSummaryFeedback
        ? ai.resumeSummaryFeedback.split(/\n+/).filter(Boolean)
        : [],
    },
  };
}
