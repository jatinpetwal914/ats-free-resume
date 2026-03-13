import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import type { ParsedResume } from '@/types';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text.trim();
}

export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim();
}

export async function extractResumeText(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === 'application/pdf') {
    return extractTextFromPDF(buffer);
  }
  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return extractTextFromDocx(buffer);
  }
  throw new Error('Unsupported file type. Use PDF or DOCX.');
}

/**
 * Very lightweight resume parser.
 * We don't try to be perfect – we extract enough structure to drive ATS-style scoring.
 */
export function parseResumeText(text: string): ParsedResume {
  const rawText = text.trim();
  const normalized = rawText.replace(/\r\n/g, '\n');

  const lines = normalized.split('\n');

  // Basic section detection by common headings.
  const sectionNames = [
    'summary',
    'objective',
    'profile',
    'experience',
    'work experience',
    'professional experience',
    'employment history',
    'education',
    'projects',
    'certifications',
    'skills',
    'technical skills',
  ];

  const sections: Record<string, string> = {};
  let currentSection = 'body';
  const sectionBuffers: Record<string, string[]> = { body: [] };

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();

    const heading = sectionNames.find((name) =>
      new RegExp(`^${name}\\b`, 'i').test(lower)
    );

    if (heading) {
      currentSection = heading;
      if (!sectionBuffers[currentSection]) sectionBuffers[currentSection] = [];
      continue;
    }

    if (!sectionBuffers[currentSection]) sectionBuffers[currentSection] = [];
    sectionBuffers[currentSection].push(trimmed);
  }

  Object.entries(sectionBuffers).forEach(([name, value]) => {
    sections[name] = value.join('\n').trim();
  });

  // Skills: primarily from skills/technical skills sections, fall back to whole doc.
  const skillsSource =
    sections['skills'] ||
    sections['technical skills'] ||
    sections['skills & expertise'] ||
    '';
  const skills = Array.from(
    new Set(
      skillsSource
        .split(/[\n,;•\-]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length <= 64)
    )
  );

  // Education lines: anything in education section that looks like a degree or institution.
  const educationSection = sections['education'] || '';
  const education = educationSection
    .split('\n')
    .map((l) => l.trim())
    .filter(
      (l) =>
        /bachelor|master|b\.tech|btech|m\.tech|be\s|bs\s|ms\s|phd|university|college/i.test(
          l
        )
    );

  // Experience: collect bullet-like lines from experience-related sections.
  const experienceText =
    sections['experience'] ||
    sections['work experience'] ||
    sections['professional experience'] ||
    sections['employment history'] ||
    '';
  const experiences = experienceText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Projects.
  const projectsText = sections['projects'] || '';
  const projects = projectsText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Certifications.
  const certsText = sections['certifications'] || '';
  const certifications = certsText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Basic keyword extraction over entire resume.
  const keywordTokens =
    normalized
      .toLowerCase()
      .match(/[a-z0-9\+\#\.\-]{2,}/g) ?? [];
  const keywords = Array.from(new Set(keywordTokens));

  // Bullets and quantified achievements.
  let bulletCount = 0;
  let quantifiedAchievementsCount = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    const isBullet = /^[-•\u2022]/.test(trimmed);
    if (isBullet) {
      bulletCount += 1;
      if (/\d/.test(trimmed) && /%|percent|revenue|users|customers|traffic|conversion/i.test(trimmed)) {
        quantifiedAchievementsCount += 1;
      }
    }
  }

  return {
    rawText,
    sections,
    skills,
    education,
    experiences,
    projects,
    certifications,
    keywords,
    bulletCount,
    quantifiedAchievementsCount,
  };
}

