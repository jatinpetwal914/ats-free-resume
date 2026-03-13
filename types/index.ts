export interface ATSSubScores {
  keywordMatch: number;
  skillsRelevance: number;
  educationMatch: number;
  experienceMatch: number;
  projectQuality: number;
  formattingQuality: number;
  quantifiedAchievements: number;
}

export interface ATSAnalysisResult {
  // Overall ATS score (0-100), already combining multiple weighted factors.
  score: number;
  // Percentage of role-specific skills/keywords matched (0-100).
  skillsMatch: number;
  // How well the resume matches the specific JD/company (0-100).
  jobMatchScore?: number;
  // Breakdown of underlying ATS factors.
  subScores?: ATSSubScores;
  // Keywords/skills that are important for the JD but missing or weak in the resume.
  missingKeywords: string[];
  // High‑level suggestions grouped by theme.
  suggestions: {
    skills: string[];
    experience: string[];
    formatting: string[];
    summary: string[];
  };
  // AI‑optimized content.
  improvedSummary: string;
  improvedBulletExamples: string[];
  // Narrative insights.
  strengths?: string[];
  weaknesses?: string[];
  resumeSummaryFeedback?: string;
  experienceFeedback?: string;
  skillsFeedback?: string;
  formattingFeedback?: string;
  skillGapAnalysis?: string[];
  // Section‑level scores (e.g. Summary, Experience, Skills, Education, Projects).
  sectionBreakdown?: Record<string, { score: number; notes: string[] }>;
  // Per‑keyword coverage (0‑100) for key JD/resume terms.
  keywordDensity?: Record<string, number>;
  // ATS‑style warnings about formatting or parsing issues.
  atsWarnings?: string[];
}

export interface JobOption {
  company: string;
  role: string;
  description: string;
  // Structured requirements for better matching.
  requiredSkills?: string[];
  preferredSkills?: string[];
  tools?: string[];
  keywords?: string[];
}

export interface ParsedResume {
  rawText: string;
  sections: Record<string, string>;
  skills: string[];
  education: string[];
  experiences: string[];
  projects: string[];
  certifications: string[];
  keywords: string[];
  bulletCount: number;
  quantifiedAchievementsCount: number;
}

export interface RuleBasedATSScoring {
  score: number;
  skillsMatch: number;
  jobMatchScore: number;
  subScores: ATSSubScores;
  missingKeywords: string[];
  sectionBreakdown: NonNullable<ATSAnalysisResult['sectionBreakdown']>;
  keywordDensity: NonNullable<ATSAnalysisResult['keywordDensity']>;
  atsWarnings: string[];
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
