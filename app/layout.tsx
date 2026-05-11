import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart AI Failover',
  description: 'MVP for AI provider failover between Gemini and Claude.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
