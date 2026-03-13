import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Resume Analyser (Is Your Resume Perfect !! ?)',
  description: 'AI-powered ATS compatibility checker for tech excellence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased text-slate-200 bg-[#0A0F1C] min-h-screen">
        {children}
      </body>
    </html>
  );
}
