import { NextRequest, NextResponse } from 'next/server';
import { extractResumeText, parseResumeText } from '@/lib/resumeParser';
import { analyzeResumeWithAI } from '@/lib/gemini';
import { getJobProfile } from '@/data/jobDescriptions';
import type {
  ParsedResume,
  RuleBasedATSScoring,
  ATSSubScores,
} from '@/types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function toSet(values: string[] | undefined): Set<string> {
  return new Set(
    (values ?? []).map((v) => v.trim().toLowerCase()).filter((v) => v.length > 0)
  );
}

function computeRuleBasedScoring(
  parsed: ParsedResume,
  jobDescription: string,
  company: string | null,
  role: string | null
): RuleBasedATSScoring {
  const profile = getJobProfile(company ?? undefined, role ?? undefined);

  const jdText = jobDescription.toLowerCase();
  const jdTokens =
    jdText.match(/[a-z0-9\+\#\.\-]{2,}/g)?.map((t) => t.toLowerCase()) ?? [];
  const jdSet = new Set(jdTokens);

  const resumeKeywords = new Set(parsed.keywords.map((k) => k.toLowerCase()));

  // Keyword match: how many JD tokens appear in resume.
  let matchedKeywords = 0;
  jdSet.forEach((kw) => {
    if (resumeKeywords.has(kw)) matchedKeywords += 1;
  });
  const keywordMatch =
    jdSet.size > 0 ? Math.round((matchedKeywords / jdSet.size) * 100) : 0;

  // Skills based on structured profile if present.
  const requiredSkillsSet = toSet(profile?.requiredSkills);
  const preferredSkillsSet = toSet(profile?.preferredSkills);
  const toolsSet = toSet(profile?.tools);

  const resumeSkillsSet = new Set(
    parsed.skills.map((s) => s.trim().toLowerCase()).filter(Boolean)
  );

  let requiredMatched = 0;
  requiredSkillsSet.forEach((s) => {
    if (resumeSkillsSet.has(s) || resumeKeywords.has(s)) requiredMatched += 1;
  });
  const skillsMatch =
    requiredSkillsSet.size > 0
      ? Math.round((requiredMatched / requiredSkillsSet.size) * 100)
      : keywordMatch;

  // Education – presence of degree keywords.
  const hasDegree = parsed.education.length > 0;
  const eduMatchFromJD = /bachelor|master|phd|b\.tech|m\.tech/i.test(jdText);
  const educationMatch = hasDegree
    ? eduMatchFromJD
      ? 90
      : 70
    : eduMatchFromJD
      ? 30
      : 50;

  // Experience – based on number of experience lines and JD expectations.
  const experienceLines = parsed.experiences.length;
  const experienceMatch =
    experienceLines >= 12 ? 90 : experienceLines >= 6 ? 75 : experienceLines > 0 ? 55 : 25;

  // Projects & quantified achievements.
  const projectQuality =
    parsed.projects.length >= 3
      ? 90
      : parsed.projects.length === 2
        ? 75
        : parsed.projects.length === 1
          ? 60
          : 30;
  const quantifiedAchievements =
    parsed.quantifiedAchievementsCount >= 5
      ? 95
      : parsed.quantifiedAchievementsCount >= 2
        ? 80
        : parsed.quantifiedAchievementsCount > 0
          ? 60
          : 30;

  // Formatting quality: bullets + clear sections.
  const hasSummary = Boolean(parsed.sections['summary'] || parsed.sections['profile']);
  const sectionCount = Object.keys(parsed.sections).length;
  const formattingQuality =
    parsed.bulletCount >= 12 && sectionCount >= 4 && hasSummary
      ? 90
      : parsed.bulletCount >= 6 && sectionCount >= 3
        ? 75
        : parsed.bulletCount > 0
          ? 55
          : 35;

  const subScores: ATSSubScores = {
    keywordMatch,
    skillsRelevance: skillsMatch,
    educationMatch,
    experienceMatch,
    projectQuality,
    formattingQuality,
    quantifiedAchievements,
  };

  // Weighted overall ATS score.
  const score =
    Math.round(
      keywordMatch * 0.25 +
        skillsMatch * 0.25 +
        educationMatch * 0.1 +
        experienceMatch * 0.15 +
        projectQuality * 0.1 +
        formattingQuality * 0.075 +
        quantifiedAchievements * 0.075
    ) || 0;

  // Job match primarily from keywords + skills + experience.
  const jobMatchScore = Math.round(
    (keywordMatch * 0.4 + skillsMatch * 0.35 + experienceMatch * 0.25) / 1
  );

  // Missing keywords – important skills/tools not present.
  const importantKeywords = new Set<string>();
  profile?.requiredSkills?.forEach((s) => importantKeywords.add(s));
  profile?.preferredSkills?.forEach((s) => importantKeywords.add(s));
  profile?.tools?.forEach((s) => importantKeywords.add(s));
  profile?.keywords?.forEach((s) => importantKeywords.add(s));

  const missingKeywords: string[] = [];
  importantKeywords.forEach((kw) => {
    const lower = kw.toLowerCase();
    if (!resumeKeywords.has(lower) && !resumeSkillsSet.has(lower)) {
      missingKeywords.push(kw);
    }
  });

  // Keyword density relative to JD-important skills.
  const keywordDensity: Record<string, number> = {};
  importantKeywords.forEach((kw) => {
    const lower = kw.toLowerCase();
    const occurrences = parsed.keywords.filter((k) => k.toLowerCase() === lower).length;
    if (occurrences === 0) {
      keywordDensity[kw] = 0;
    } else if (occurrences === 1) {
      keywordDensity[kw] = 60;
    } else if (occurrences === 2) {
      keywordDensity[kw] = 80;
    } else {
      keywordDensity[kw] = 95;
    }
  });

  // Section breakdown.
  const sectionBreakdown: NonNullable<RuleBasedATSScoring['sectionBreakdown']> =
    {
      Summary: {
        score: hasSummary ? 80 : 45,
        notes: hasSummary
          ? ['Summary/profile section detected.']
          : ['Consider adding a concise summary at the top.'],
      },
      Experience: {
        score: experienceMatch,
        notes:
          experienceLines < 6
            ? ['Add more detailed bullet points under experience.']
            : ['Good amount of experience content detected.'],
      },
      Skills: {
        score: skillsMatch,
        notes:
          skillsMatch < 70
            ? ['Highlight more role-specific technical skills.']
            : ['Core skills align reasonably well with the role.'],
      },
      Education: {
        score: educationMatch,
        notes:
          educationMatch < 60
            ? ['Clarify degree, institution and graduation year.']
            : ['Degree information detected.'],
      },
      Projects: {
        score: projectQuality,
        notes:
          parsed.projects.length === 0
            ? ['Add 1–3 relevant projects with impact and technologies used.']
            : ['Projects section present – ensure bullets focus on impact.'],
      },
      Certifications: {
        score: parsed.certifications.length > 0 ? 80 : 40,
        notes:
          parsed.certifications.length > 0
            ? ['Certifications detected – highlight the most relevant ones.']
            : ['Optional: add relevant certifications if you have them.'],
      },
      'Job Match': {
        score: jobMatchScore,
        notes:
          jobMatchScore < 70
            ? ['Align keywords and examples more closely with the target role.']
            : ['Resume content aligns well with the selected role.'],
      },
    };

  const atsWarnings: string[] = [];
  if (parsed.bulletCount < 5) {
    atsWarnings.push(
      'Very few bullet points detected – ATS systems prefer scannable bullet lists.'
    );
  }
  if (parsed.skills.length < 8) {
    atsWarnings.push('Skills section looks thin – add more specific tools and technologies.');
  }
  if (rawLengthTooShort(parsed.rawText)) {
    atsWarnings.push('Resume content is quite short – consider adding more detail.');
  }

  return {
    score,
    skillsMatch,
    jobMatchScore,
    subScores,
    missingKeywords,
    sectionBreakdown,
    keywordDensity,
    atsWarnings,
  };
}

function rawLengthTooShort(text: string): boolean {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return wordCount < 250;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;
    const company = (formData.get('company') as string | null) ?? null;
    const role = (formData.get('role') as string | null) ?? null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!jobDescription?.trim()) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractResumeText(buffer, file.type);

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        {
          error:
            'Could not extract enough text from the resume. Ensure the file is not scanned or image-only.',
        },
        { status: 400 }
      );
    }

    const parsed = parseResumeText(resumeText);
    const ruleBased = computeRuleBasedScoring(parsed, jobDescription, company, role);

    const result = await analyzeResumeWithAI(
      resumeText,
      jobDescription,
      parsed,
      ruleBased,
      company,
      role
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error('Analyze error:', err);
    const message = err instanceof Error ? err.message : 'Analysis failed';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
