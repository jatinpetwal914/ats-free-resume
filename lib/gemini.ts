import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ATSAnalysisResult } from '@/types';

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
  jobDescription: string
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

  const systemPrompt = `You are an ATS (Applicant Tracking System) and professional recruiter. Analyze the resume against the job description. Return ONLY valid JSON, no markdown or extra text.`;

  const userPrompt = `Analyze this resume against the job description.

RESUME:
---
${resumeText.slice(0, 12000)}
---

JOB DESCRIPTION:
---
${jobDescription.slice(0, 4000)}
---

Return ONLY a single JSON object with this exact structure (use arrays/lists as specified):
{
  "score": <number 0-100, overall ATS compatibility score>,
  "skillsMatch": <number 0-100, percentage of job-required skills found in resume>,
  "missingKeywords": [<array of important keywords from job description that are missing in resume>],
  "suggestions": {
    "skills": [<array of specific skill suggestions to add>],
    "experience": [<array of experience-related improvements>],
    "formatting": [<array of formatting/ATS compatibility fixes>],
    "summary": [<array of summary or profile section improvements>]
  },
  "improvedSummary": "<2-4 sentence rewritten professional summary optimized for this role>",
  "improvedBulletExamples": [<array of 3-5 rewritten achievement bullet points with quantification and action verbs>],
  "strengths": [<array of 3-5 resume strengths for this role>],
  "weaknesses": [<array of 3-5 areas to improve>],
  "sectionBreakdown": {
    "<section name e.g. Summary>": { "score": <0-100>, "notes": [<array of 1-2 notes>] },
    "<Experience>": { "score": <0-100>, "notes": [<array>] },
    "<Skills>": { "score": <0-100>, "notes": [<array>] },
    "<Education>": { "score": <0-100>, "notes": [<array>] }
  },
  "keywordDensity": {
    "<keyword from job>": <number 0-100 representing how well resume reflects this>,
    "<another keyword>": <number>
  },
  "atsWarnings": [<array of ATS compatibility warnings, e.g. table formatting, graphics, wrong file type>]
}`;

  const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
  const response = result.response;
  const content = response.text();
  if (!content) throw new Error('Empty response from Gemini');

  const raw = extractJSON(content);
  const parsed = JSON.parse(raw) as ATSAnalysisResult;
  return {
    ...JSON_SCHEMA,
    ...parsed,
    suggestions: {
      skills: parsed.suggestions?.skills ?? [],
      experience: parsed.suggestions?.experience ?? [],
      formatting: parsed.suggestions?.formatting ?? [],
      summary: parsed.suggestions?.summary ?? [],
    },
  };
}
