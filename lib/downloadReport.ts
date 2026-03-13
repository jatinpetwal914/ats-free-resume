'use client';

import type { ATSAnalysisResult } from '@/types';

function escapeText(s: string): string {
  return (s || '').replace(/[^\x20-\x7E\n\r]/g, ' ');
}

export function downloadReportAsPDF(
  result: ATSAnalysisResult,
  fileName: string,
  company: string,
  role: string
): void {
  import('jspdf').then((mod: { default: new () => import('jspdf').jsPDF }) => {
    const doc = new mod.default();
    let y = 20;
    const lineH = 6;
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.text('Resume Analyser (Is Your Resume Perfect !! ?) - Report', 20, y);
    y += lineH + 4;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${escapeText(fileName)} · ${escapeText(company)} · ${escapeText(role)}`, 20, y);
    y += lineH + 6;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`ATS Compatibility Score: ${result.score}`, 20, y);
    y += lineH;
    doc.text(`Skills Match: ${result.skillsMatch}%`, 20, y);
    y += lineH + 4;

    const addSection = (title: string, lines: string[]) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(11);
      doc.setTextColor(34, 211, 238);
      doc.text(title, 20, y);
      y += lineH;
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      lines.forEach((line) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        const wrapped = doc.splitTextToSize(escapeText(line), pageW - 40);
        wrapped.forEach((l: string) => {
          doc.text(l, 20, y);
          y += lineH;
        });
      });
      y += 2;
    };

    if (result.missingKeywords?.length)
      addSection('Missing Keywords', result.missingKeywords);
    if (result.improvedSummary)
      addSection('Improved Summary', [result.improvedSummary]);
    if (result.strengths?.length) addSection('Strengths', result.strengths);
    if (result.weaknesses?.length)
      addSection('Areas to Improve', result.weaknesses);
    if (result.suggestions?.skills?.length)
      addSection('Skill Suggestions', result.suggestions.skills);
    if (result.improvedBulletExamples?.length)
      addSection('Improved Bullet Examples', result.improvedBulletExamples);

    doc.save(`ats-report-${fileName.replace(/\.[^.]+$/, '')}.pdf`);
  });
}
