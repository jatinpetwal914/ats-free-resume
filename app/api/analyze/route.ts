import { NextRequest, NextResponse } from 'next/server';
import { extractResumeText } from '@/lib/resumeParser';
import { analyzeResumeWithAI } from '@/lib/gemini';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;

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
        { error: 'Could not extract enough text from the resume. Ensure the file is not scanned or image-only.' },
        { status: 400 }
      );
    }

    const result = await analyzeResumeWithAI(resumeText, jobDescription);
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
