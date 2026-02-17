export interface ATSAnalysisResult {
  score: number;
  skillsMatch: number;
  missingKeywords: string[];
  suggestions: {
    skills: string[];
    experience: string[];
    formatting: string[];
    summary: string[];
  };
  improvedSummary: string;
  improvedBulletExamples: string[];
  strengths?: string[];
  weaknesses?: string[];
  sectionBreakdown?: Record<string, { score: number; notes: string[] }>;
  keywordDensity?: Record<string, number>;
  atsWarnings?: string[];
}

export interface JobOption {
  company: string;
  role: string;
  description: string;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: number;
  fileName: string;
  company: string;
  role: string;
  score: number;
  result: ATSAnalysisResult;
}
