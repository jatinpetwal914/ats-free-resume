# ATS Pro Resume Analyzer

Production-ready ATS (Applicant Tracking System) resume checker built with Next.js 14, TailwindCSS, Framer Motion, and OpenAI.

## Tech stack

- **Frontend:** Next.js 14 (App Router), TailwindCSS, Framer Motion, Lucide React
- **Backend:** Next.js API Routes
- **File parsing:** pdf-parse (PDF), mammoth (DOCX)
- **AI:** Google Gemini API
- **Deployment:** Vercel-ready

## Setup

1. **Clone and install**

   ```bash
   cd "ats pro resume analyzer"
   npm install
   ```

2. **Environment variables**

   Create `.env.local` in the project root:

   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   Get your API key from [Google AI Studio](https://aistudio.google.com/apikey). Never commit `.env.local` or expose the key to the frontend.

3. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Vercel deployment

1. Push the project to GitHub (or connect another Git provider).
2. In [Vercel](https://vercel.com), import the repository.
3. Add environment variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your Gemini API key
4. Deploy. The build uses `next build`; no extra config required.

## Features

- Resume upload (PDF & DOCX), drag-and-drop, validation
- Company & role dropdown with sample job descriptions (Google, Amazon, Microsoft, Meta, Startup)
- Custom job description paste
- ATS analysis: score (0–100), skills match, missing keywords, suggestions (skills, experience, formatting, summary)
- Improved summary and bullet examples (copy / download)
- Heatmap view, keyword density, section breakdown, strengths & weaknesses, ATS warnings
- History of analyses (localStorage)
- Save report as PDF
- Animated UI, confetti for score ≥ 85, dark theme, glassmorphism

## Project structure

```
/app
  page.tsx              # Landing
  analyze/page.tsx      # Analyze flow & results
  api/analyze/route.ts  # POST analyze API
/components
  UploadCard, ScoreCard, SuggestionsPanel, Loader
  HeatmapView, HistoryPanel, BackgroundBlobs
/lib
  gemini.ts, resumeParser.ts, history.ts, downloadReport.ts
/data
  jobDescriptions.ts
/types
  index.ts
```

## Security

- Gemini API key is used only in server-side API routes (`/api/analyze`).
- Keys are read from `process.env.GEMINI_API_KEY`; never hardcode or expose to the client.

## License

MIT.
