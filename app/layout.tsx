import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ATS Pro Resume Analyzer',
  description: 'AI-powered ATS resume checker for tech excellence',
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
